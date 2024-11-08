import { Request, Response } from 'express';
import {
  shineAuthHost,
  clientId as client_id,
  clientSecret as client_secret,
  redirectUri as redirect_uri,
} from '../config';
import axios from 'axios';

const refreshToken = async (req: Request, res: Response) => {
  const { refresh_token } = req.query;
  try {
    const result = await axios.get<{ access_token: string }>(`${shineAuthHost}/oauth2/token`, {
      params: {
        client_id,
        client_secret,
        grant_type: 'refresh_token',
        refresh_token,
        redirect_uri,
      },
    });
    console.log('Access token updated ⬆️');
    res.status(200).send({
      access_token: result.data.access_token,
    });
  } catch (error) {
    res.status(error.status).send({
      status: error.status,
      message: error.body.message,
    });
  }
};

export default refreshToken;
