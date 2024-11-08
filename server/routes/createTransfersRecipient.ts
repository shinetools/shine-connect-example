import { Request, Response } from 'express';
import { shineRequest } from '../request';

const createTransfersRecipient = async (req: Request, res: Response) => {
  const { access_token, companyProfileId, companyUserId, iban, swiftBic, uid, name } = req.query;

  try {
    const data = await shineRequest({
      method: 'POST',
      path: `/bank/transfers/recipients`,
      authorization: access_token as string,
      payload: {
        companyProfileId,
        companyUserId,
        uid,
        iban,
        swiftBic,
        name,
      },
    });
    res.status(200).send(data);
  } catch (error) {
    console.log(error);
    res.status(error.status).send({
      status: error.status,
      message: error.body?.message,
    });
  }
};

export default createTransfersRecipient;
