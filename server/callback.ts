import { Request, Response } from 'express';
import { clientId, clientSecret, redirectUri, shineAuthHost } from './config';
import qs from 'qs';
import axios from 'axios';

const callback = async (req: Request, res: Response) => {
  const { code: authorizationCode, error } = req.query;

  if (error && !authorizationCode) {
    console.warn('Error occurred; authorization denied ⛔️', error);
    return res.redirect('/?authorized=false');
  }

  console.log('Authorization request accepted 🎉');

  try {
    // ask for consent
    const response = await axios.get(`${shineAuthHost}/oauth2/token`, {
      params: {
        client_id: clientId,
        client_secret: clientSecret,
        grant_type: 'authorization_code',
        code: authorizationCode,
        redirect_uri: redirectUri,
      },
    });

    const { access_token, refresh_token, metadata } = response.data;
    console.log('Tokens retrieved ✅');

    const { companyProfileId, uid, companyUserId } = metadata;

    // Display success
    // DANGER:  This an example, in a real world better to not share the access_token with the client application.
    res.redirect(
      `/?${qs.stringify({
        authorized: true,
        access_token,
        refresh_token,
        companyProfileId,
        companyUserId,
        uid,
      })}`,
    );
  } catch (error) {
    console.error('Error retrieving tokens ⛔️', error);
    res.redirect('/?authorized=false');
  }
};

export default callback;
