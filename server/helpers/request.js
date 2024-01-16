const https = require('https');
const fs = require('fs');
const httpSignature = require('http-signature');

const config = require('../config');
const { generateDigest } = require('./digest');
const RequestError = require('./requestError');

const SHINE_CONNECT_PRODUCTION_HOST = 'connect.api.shine.fr';
const SHINE_CONNECT_STAGING_HOST = 'connect.api.staging.shine.fr';
const isDev = process.env.NODE_ENV !== 'production';

const SHINE_CONNECT_HOST = isDev
  ? SHINE_CONNECT_STAGING_HOST
  : SHINE_CONNECT_PRODUCTION_HOST;

const QWAC_KEY = fs.readFileSync(config.QWAC_KEY_PATH);
const QSEAL_KEY = fs.readFileSync(config.QSEAL_KEY_PATH);
const QWAC_CERT = fs.readFileSync(config.QWAC_CERT_PATH);
const ROOT_CERT = fs.readFileSync(config.ROOT_CA_PATH);

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

const signRequest = (request) => {
  const qsealHeaders = getRequiredQsealHeaders();
  const qsealKey = fs.readFileSync(config.QSEAL_KEY_PATH);
  const qsealKeyId = config.KEY_ID;

  if (request.getHeaders().digest) {
    qsealHeaders.push('digest');
  }

  httpSignature.sign(request, {
    authorizationHeaderName: 'Signature',
    headers: qsealHeaders,
    key: qsealKey,
    keyId: qsealKeyId,
  });
};

const getRequestHeaders = (method, port = 443) => ({
  'PSU-Accept':
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
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

const doRequest = ({ method, path, authorization, payload }) =>
  new Promise((resolve, reject) => {
    let postData;
    if (payload) {
      try {
        postData = JSON.stringify(payload);
        console.log({ postData });
      } catch (error) {
        reject(error);
      }
    }

    const options = {
      host: SHINE_CONNECT_HOST,
      path,
      method,
      headers: {
        ...getRequestHeaders(),
        ...(postData
          ? {
              'Content-Length': postData.length,
              'Content-Type': 'application/json',
              digest: generateDigest(postData, QSEAL_KEY),
            }
          : {}),
        Authorization: `Bearer ${authorization}`,
      },
      // Client certificates for mutual TLS authentication
      key: QWAC_KEY,
      cert: QWAC_CERT,
      ca: ROOT_CERT,
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

          if (res.statusCode >= 400) {
            reject(new RequestError(responseBody, res.statusCode));
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
      console.log('Error');
      console.error(e);
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

module.exports = { doRequest };
