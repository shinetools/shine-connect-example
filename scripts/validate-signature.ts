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

const req: Body = {
  method: 'GET',
  url: '/users/profiles/e719f43e-a9bb-4dd8-bf61-68c0b251250e',
  headers: {
    public_load_balancer: 'false',
    client_cert_present: 'true',
    client_cert_chain_verified: 'true',
    'psu-accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    'psu-accept-charset': 'utf-8',
    'psu-accept-encoding': 'gzip, deflate, br',
    'psu-accept-language': 'en-US,en;q=0.9',
    'psu-date': '2019-01-01T00:00:00Z',
    'psu-http-method': 'GET',
    'psu-ip-address': '127.0.0.1',
    'psu-ip-port': 443,
    'psu-referer': 'https://localhost:443/',
    'psu-user-agent':
      'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36',
    authorization:
      'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJodHRwczovL2FwaS5zaGluZS5mciIsImF6cCI6IjZjOWU2ZjZmLTM0OGEtNGUyOC1hZTA5LWY1OWJhZDZkYzZiMyIsImNsYWltcyI6eyJjb21wYW55UHJvZmlsZUlkIjoiZGJkNmE0ZWUtOTlkNS00MzFiLWE3ZTctZWYwM2RiYWU1ODJhIiwiY29tcGFueVVzZXJJZCI6IjRiNDA2ZDUzLTRhZTEtNDkwOC05N2E0LTc1Y2EzZmUzZmU3NiJ9LCJleHAiOjE3MTMzMzc0ODQsImlhdCI6MTcxMzMzMzg4NCwiaXNzIjoiaHR0cHM6Ly9hY2NvdW50cy5zaGluZS5mciIsInNjb3BlIjoib3BlbmlkIHByb2ZpbGUgdXNlcjpwcm9maWxlOnJlYWQiLCJzdWIiOiJlNzE5ZjQzZS1hOWJiLTRkZDgtYmY2MS02OGMwYjI1MTI1MGUifQ.sjL1HQOvJuFgkLxO0tbGMBjnPRStKftvkuqTeMg3SBeqNCsgMrR4S07KObZpeqyHMhIgLwQPK73mLLe8in_uHwo-Brkc8LVAgvcasIV4wDGkdgwjUEDwXHrU7tPqkxYoateTHLktHsWh_Cc1Q-R2qsbQHmGONNbwrKeY7B8tIREh-JW0iqqAYZwza5ouGnVzi3TrPc-AHT4mOwl54c5LZqBMHXMFYtjMiSveJ2BwOVi4IBm4tXWpQas8UVIKzU2MXUPg6om5_PW_pOW0zp9st3bgRlw5QshdllC1EDEzMIhvZDmAPz9mjbKmT-j5SiqBlXsl_KhWMbKTxuOwGQqTxQ',
    host: 'localhost:10081',
    date: 'Wed, 17 Apr 2024 07:04:20 GMT',
    signature:
      'keyId="PSDFR-ACPR-71758",algorithm="rsa-sha256",headers="(request-target) date psu-ip-address psu-ip-port psu-http-method psu-date psu-user-agent psu-referer psu-accept psu-accept-charset psu-accept-encoding psu-accept-language",signature="Z+zWXASDGNZ6bxdJ7vbH+sa9fewp4LVQ0VWcufhyo84tLau+9sklQYviAYp3s6ZeK0o/LwYBrlFIe4A7Auz3lJ42c7TqcP+tZpJqniVhKL0V9LjAdm/VpKgINF7qzStcvAE7P0Vph2hO9YnXTsTjKUtHu2mBUpCNVKXgNVRw4CMsLOnObijTFfKGb6RLsMb6g6ORVyOwZmsSsTgw+pboPI2+j8XCdVvmP1/It+dEvnog7Po4Am/Akqryo0Gc0gikveyRsyGiwK0nmkOiO7doDhVQ9MaQqIfCqvosXEQRstune+N4WbLzO3H1g9XIricdgDhgSeB93eKXhJ5+ZkdziQ=="',
  },
};

const certStr = readFileSync('./qseal.pem', 'utf-8');

validateSignature(req, certStr);
