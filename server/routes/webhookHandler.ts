import { NextFunction, Request, Response } from 'express';

import { readFromDb, verifyWebHookSignature, writeToDb } from '../webhookUtils';

const webhookHandler = async (req: Request, res: Response, next: NextFunction) => {
  console.log('Webhook received:', req.headers, req.body);
  if (!verifyWebHookSignature(req)) {
    return res.status(400).send('Invalid signature');
  }

  const { companyProfileId } = req.body.entity;
  if (!companyProfileId) {
    return res.status(400).send('Invalid data companyProfileId missing');
  }

  const webhooks = readFromDb(companyProfileId);
  webhooks.push(req.body.entity);
  writeToDb(companyProfileId, webhooks);
  res.status(200).send('Webhook received');
};

export default webhookHandler;
