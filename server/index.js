const next = require('next');
const express = require('express');
const qs = require('querystring');
const request = require('request-promise-native');
const url = require('url');
const config = require('./config');

const { doRequest } = require('./helpers/request');

const SHINE_AUTHENTICATION_PRODUCTION_HOST = 'https://api.shine.fr/v2/authentication';
const SHINE_AUTHENTICATION_STAGING_HOST = 'https://api.staging.shine.fr/v2/authentication';
const {
  CLIENT_ID: client_id,
  CLIENT_SECRET: client_secret,
  SCOPE: scope,
  REDIRECT_URI: redirect_uri,
} = config;
const PORT = process.env.PORT || 9876;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

const SHINE_CONNECT_HOST = dev
  ? SHINE_AUTHENTICATION_STAGING_HOST
  : SHINE_AUTHENTICATION_PRODUCTION_HOST;
const REDIRECT_PATH = url.parse(redirect_uri).pathname;

app.prepare().then(() => {
  const server = express();

  // Click on 'Login with Shine' button
  server.get('/shine-connect', (req, res) => {
    const redirectTo = `${SHINE_CONNECT_HOST}/oauth2/authorize?${qs.stringify({
      client_id,
      scope,
      redirect_uri,
    })}`;
    res.redirect(redirectTo);
  });

  // Redirected by Shine with authorization result
  server.get(REDIRECT_PATH, async (req, res) => {
    const { code, error } = req.query;
    if (error || !code) {
      console.log('Authorization request denied 😞');
      return res.redirect('/?authorized=false');
    }
    console.log('Authorization request accepted 🎉');
    try {
      const { access_token, refresh_token, metadata } = await request({
        uri: `${SHINE_CONNECT_HOST}/oauth2/token`,
        method: 'GET',
        json: true,
        qs: {
          client_id,
          client_secret,
          grant_type: 'authorization_code',
          code,
          redirect_uri,
        },
      });
      console.log('Tokens retrieved ✅');

      const { companyProfileId } = metadata;
      // Display success
      res.redirect(
        `/?${qs.stringify({
          authorized: true,
          access_token,
          refresh_token,
          companyProfileId,
        })}`,
      );
    } catch (e) {
      console.error(e);
      res.redirect('/?authorized=false');
    }
  });

  server.get('/refresh-token', async (req, res) => {
    const { refresh_token } = req.query;
    try {
      const { access_token: newAccessToken } = await request({
        uri: `${SHINE_CONNECT_HOST}/oauth2/token`,
        method: 'GET',
        json: true,
        qs: {
          client_id,
          client_secret,
          grant_type: 'refresh_token',
          refresh_token,
          redirect_uri,
        },
      });
      console.log('Access token updated ⬆️');
      res.status(200).send({
        access_token: newAccessToken,
      });
    } catch (e) {
      console.error(e);
      res.status(500).send({ message: 'Error while refreshing token' });
    }
  });

  server.get('/bank-accounts', async (req, res) => {
    const { access_token, companyProfileId } = req.query;

    try {
      const data = await doRequest({
        method: 'GET',
        path: `/bank/accounts/query?companyProfileId=${companyProfileId}`,
        authorization: access_token,
      });
      res.status(200).send(data);
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: 'Error while making a request' });
    }
  });

  server.get('*', (req, res) => handle(req, res));

  server.listen(PORT, () => console.info(`Server listening on port ${PORT}`));
});
