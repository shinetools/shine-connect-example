import qs from 'qs';
import { Request, Response } from 'express';
import { redirectUri, clientId, defaultScope, port, shineAuthHost } from './config';

const login = async (req: Request, res: Response) => {
  const { requestedScope } = req.query;
  const scope = requestedScope ?? defaultScope;
  const redirectTo = `${shineAuthHost}/oauth2/authorize?${qs.stringify({
    client_id: clientId,
    scope,
    redirect_uri: redirectUri,
  })}`;
  res.redirect(redirectTo);
};

export default login;
