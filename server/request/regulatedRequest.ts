import { shineApiHost, isLocal, qsealKeyPath, keyId, qwacCertPath, qwacKeyPath, rootCAPath } from '../config';
import { readFileSync } from 'fs';
import httpSignature, { SignOptions } from 'http-signature';
import { ClientRequest } from 'http';
import https from 'https';
import crypto from 'crypto';

/**
 * This function is exclusively for the Shine development environment.
 * Its content will be automatically injected by the Shine load balancer,
 * so there is no action required from developers.
 */
const addLocalLoadBalancerHeaders = () => ({
  public_load_balancer: 'false',
  client_cert_present: 'true',
  client_cert_chain_verified: 'true',
});

export type DoRequestParams = {
  method: string;
  path: string;
  authorization: string;
  payload?: unknown;
  shortLivedToken?: string;
};
export const convertObjectToString = (payload: unknown) => {
  if (!payload) return null;
  try {
    const postData = JSON.stringify(payload);
    return postData;
  } catch (error) {
    throw error;
  }
};

const getRequiredQsealHeaders = () => [
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

const getRequestHeaders = (method, port = 443) => ({
  'PSU-Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
  'PSU-Accept-Charset': 'utf-8',
  'PSU-Accept-Encoding': 'gzip, deflate, br',
  'PSU-Accept-Language': 'en-US,en;q=0.9',
  'PSU-Date': '2019-01-01T00:00:00Z',
  'PSU-HTTP-Method': method ?? 'GET',
  'PSU-IP-Address': '127.0.0.1',
  'PSU-IP-Port': port,
  'PSU-Referer': `https://localhost:${port}/`,
  'PSU-User-Agent':
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/71.0.3578.98 Safari/537.36',
});

const generateDigest = (body: string) => {
  const privateKey = readFileSync(qsealKeyPath, 'utf-8').toString();
  const sign = crypto.createSign('SHA256');
  sign.write(body);
  sign.end();
  return sign.sign(privateKey, 'base64');
};

const signRequest = (request: ClientRequest) => {
  const qsealHeaders = getRequiredQsealHeaders();
  const qsealKey = readFileSync(qsealKeyPath, 'utf-8').toString();
  const qsealKeyId = keyId;

  if (request.getHeaders().digest) {
    qsealHeaders.push('digest');
  }

  httpSignature.sign(request, {
    authorizationHeaderName: 'Signature',
    headers: qsealHeaders,
    key: qsealKey,
    keyId: qsealKeyId,
    expiresIn: 3600,
  } as unknown as SignOptions);
};

export const regulatedRequest = async (params: DoRequestParams) =>
  new Promise((resolve, reject) => {
    const { method, path, authorization, payload, shortLivedToken } = params;
    let postData;
    if (payload) {
      try {
        postData = JSON.stringify(payload);
      } catch (error) {
        reject(error);
      }
    }

    const port = 443;

    const options = {
      host: shineApiHost,
      port,
      path,
      method,
      headers: {
        ...(isLocal ? addLocalLoadBalancerHeaders() : {}), // This line is exclusively for the Shine development environment
        ...(shortLivedToken ? { 'short-lived-token': shortLivedToken } : {}),
        ...getRequestHeaders(method, port),
        ...(postData
          ? {
              'Content-Length': postData.length,
              'Content-Type': 'application/json',
              digest: generateDigest(postData),
            }
          : {}),
        Authorization: `Bearer ${authorization}`,
      },
      // Client certificates for mutual TLS authentication
      cert: readFileSync(qwacCertPath),
      key: readFileSync(qwacKeyPath),
    };

    // Make the HTTPS request
    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          let responseBody;
          if (data) {
            if (res.headers['content-type'].includes('application/json')) {
              responseBody = JSON.parse(data);
            } else {
              responseBody = data;
            }
          }

          if (responseBody.status >= 400) {
            reject({
              body: responseBody,
              status: res.statusCode,
            });
          } else {
            resolve({
              body: responseBody,
              status: res.statusCode,
            });
          }
        } catch (error) {
          reject(error);
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    signRequest(req);
    if (postData) {
      req.write(postData);
      req.end();
    } else {
      req.end();
    }
  });
