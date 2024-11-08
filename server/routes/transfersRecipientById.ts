import { Request, Response } from 'express';
import { shineRequest } from '../request';

const getTransfersRecipientById = async (req: Request, res: Response) => {
  const { access_token, transfersRecipientId } = req.query;

  try {
    const data = await shineRequest({
      method: 'GET',
      path: `/bank/transfers/recipients/${transfersRecipientId}`,
      authorization: access_token as string,
    });
    res.status(200).send(data);
  } catch (error) {
    res.status(error.status).send({
      status: error.status,
      message: error.body.message,
    });
  }
};

export default getTransfersRecipientById;
