const next = require('next');
const express = require('express');
const qs = require('querystring');
const request = require('request-promise-native');

const SHINE_CONNECT_HOST = 'https://api.shine.fr/v2/authentication';
const {
  CLIENT_ID: client_id,
  CLIENT_SECRET: client_secret,
  SCOPE: scope,
  REDIRECT_URI: redirect_uri,
} = process.env;
const PORT = process.env.PORT || 9876;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

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
  server.get('/redirect-uri', async (req, res) => {
    const { code, error } = req.query;
    if (error || !code) {
      console.log('Authorization request denied 😞');
      return res.redirect('/?authorized=false');
    }
    console.log('Authorization request accepted 🎉');
    try {
      const { access_token, refresh_token } = await request({
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
      // Do something with the access_token & refresh_token
      // ...
      // Display success
      res.redirect(`/?${qs.stringify({
        authorized: true,
        access_token,
        refresh_token,
      })}`);
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

  server.get('*', (req, res) => handle(req, res));

  server.listen(PORT, () => console.info(`Server listening on port ${PORT}`));
});