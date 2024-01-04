const https = require('http');

const RequestError = require('./requestError');

const SHINE_CONNECT_PRODUCTION_HOST = 'connect.api.shine.fr';
const SHINE_CONNECT_STAGING_HOST = 'localhost';

const isDev = process.env.NODE_ENV !== 'production';

const SHINE_CONNECT_HOST = isDev
  ? SHINE_CONNECT_STAGING_HOST
  : SHINE_CONNECT_PRODUCTION_HOST;

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
      port: 10081,
      path,
      method,
      headers: {
        ...(postData
          ? {
              'Content-Length': postData.length,
              'Content-Type': 'application/json',
            }
          : {}),
        Authorization: `Bearer ${authorization}`,
      },
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

    if (postData) {
      req.write(postData);
      req.end();
    } else {
      req.end();
    }
  });

module.exports = { doRequest };
