const https = require('https');
const fs = require('fs');

const config = require('../config');

const SHINE_CONNECT_PRODUCTION_HOST = 'connect.api.shine.fr';
const SHINE_CONNECT_STAGING_HOST = 'https://connect.api.staging.shine.fr';
const isDev = process.env.NODE_ENV !== 'production';

const SHINE_CONNECT_HOST = isDev
  ? SHINE_CONNECT_STAGING_HOST
  : SHINE_CONNECT_PRODUCTION_HOST;

const doRequest = ({ method, path, authorization }) => {
  const qwacKey = fs.readFileSync(config.QWAC_KEY_PATH);
  const qwacCert = fs.readFileSync(config.QWAC_CERT_PATH);
  const options = {
    host: SHINE_CONNECT_HOST,
    path,
    port: '443',
    method,
    headers: {
      Authorization: `Bearer ${authorization}`,
      'Content-Type': 'application/json',
    },
    // Client certificates for mutual TLS authentication
    key: qwacKey,
    cert: qwacCert,
  };

  // Make the HTTPS request
  const req = https.request(options, (res) => {
    console.log('statusCode:', res.statusCode);
    console.log('headers:', res.headers);

    let rawData = '';
    res.on('data', (d) => {
      console.log('Data received');
      rawData += d;
    });

    res.on('end', () => {
      console.log('End of response');
      console.log(rawData);
      req.end();
    });
  });

  req.on('error', (e) => {
    console.log('Error');
    console.error(e);
    req.end();
  });
};

module.exports = { doRequest };
