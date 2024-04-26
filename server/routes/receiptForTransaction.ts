import { Request, Response } from 'express';
import { shineRequest } from '../request';

const getReceiptForTransaction = async (req: Request, res: Response) => {
  const { access_token, transactionId } = req.query;

  try {
    const data = await shineRequest({
      method: 'GET',
      path: `/receipts/query?transactionId=${transactionId}`,
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

export default getReceiptForTransaction;
