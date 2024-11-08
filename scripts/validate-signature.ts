import { readFileSync } from 'fs';
import { ClientRequest } from 'http';
import { parseRequest, ParseOptions, verifySignature } from 'http-signature';
import { parseCertificate } from 'sshpk';

const getRequiredQsealHeaders = (): string[] => [
  '(request-target)',
  'date',
  'psu-ip-address',
  'psu-ip-port',
  'psu-http-method',
  'psu-date',
  'psu-user-agent',
  'psu-referer',
  'psu-accept',
  'psu-accept-charset',
  'psu-accept-encoding',
  'psu-accept-language',
];

const CERTIFICATE_FORMAT = 'pem';

export type Body = {
  method: string;
  url: string;
  headers: Record<string, string | number>;
};

const validateSignature = async (body: Body, certificate: string) => {
  const parsedSignature = parseRequest(
    body as unknown as ClientRequest,
    {
      authorizationHeaderName: 'signature',
      headers: getRequiredQsealHeaders(),
      strict: true,
    } as unknown as ParseOptions,
  );
  const signatureKeyId = parsedSignature.params.keyId;

  const parsedCertificate = parseCertificate(certificate, CERTIFICATE_FORMAT);
  const { subjectKey: publicKey } = parsedCertificate;

  const result = verifySignature(parsedSignature, publicKey.toString(CERTIFICATE_FORMAT));
  console.log('Signature verified result for signatureKeyId:', signatureKeyId);
  console.log(result);
};

if (process.argv.length < 4) {
  console.error('Usage: node validate-signature.js <certificate> <request-body>');
  process.exit(1);
}

const certificate = readFileSync(process.argv[2], 'utf-8');
const body = JSON.parse(readFileSync(process.argv[3], 'utf-8'));

validateSignature(body, certificate);
