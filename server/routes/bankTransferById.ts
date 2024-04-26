import { Request, Response } from 'express';
import { shineRequest } from '../request';

const getBankTransferById = async (req: Request, res: Response) => {
  const { access_token, bankTransferId } = req.query;

  try {
    const data = await shineRequest({
      method: 'GET',
      path: `/bank/transfers/${bankTransferId}`,
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

export default getBankTransferById;
