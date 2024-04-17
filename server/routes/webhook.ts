import { Request, Response } from 'express';
import { readFromDb } from '../webhookUtils';

const webhook = async (req: Request, res: Response) => {
  const { companyProfileId } = req.query;

  try {
    const webhooks = readFromDb(companyProfileId as string);
    res.status(200).send(webhooks);
  } catch (error) {
    res.status(error.status).send({
      status: error.status,
      message: error.body.message,
    });
  }
};

export default webhook;
