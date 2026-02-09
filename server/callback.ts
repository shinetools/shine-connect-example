import { Request, Response } from 'express';
import { clientId, clientSecret, redirectUri, shineAuthHost } from './config';
import qs from 'qs';
import axios from 'axios';

const callback = async (req: Request, res: Response) => {
  const { code, error } = req.query;
  if (error || !code) {
    console.log('Authorization request denied 😞');
    return res.redirect('/?authorized=false');
  }
  console.log('Authorization request accepted 🎉');
  try {
    // ask for consent
    const response = await axios.post(`${shineAuthHost}/oauth2/token`, {
      client_id: clientId,
      client_secret: clientSecret,
      grant_type: 'authorization_code',
      code,
      redirect_uri: redirectUri,
    });
    const { access_token, refresh_token, metadata, id_token } = response.data;
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
        id_token,
      })}`,
    );
  } catch (e) {
    console.error(e);
    res.redirect('/?authorized=false');
  }
};

export default callback;
