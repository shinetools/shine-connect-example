import { createHmac } from 'crypto';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { webhookSecret } from './config';
import { Request, Response } from 'express';

export const rawBodySaver = function (req: Request, res: Response, buf: Buffer, encoding: BufferEncoding) {
  if (buf && buf.length) {
    (req as any).rawBody = buf.toString(encoding || 'utf8');
  }
};

export const verifyWebHookSignature = (req: Request): boolean => {
  // 1. Extract the timestamp and signatures from the corresponding headers
  const timestamp = req.headers.date; // Date header
  const signature = req.headers['shine-signature']; // Shine-Signature header

  // 2. Prepare the `signedPayload` string created by concatenating the timestamp, the `.` character and the request JSON body
  const { rawBody } = req as any; // should be the raw unparsed body as JSON parsing can change fields ordering and alter signature
  const signedPayload = `${timestamp}.${rawBody}`;

  // 3. Determine the expected signature by computing an HMAC with the SHA512 hash function using the endpoint's secret as the key and the `signedPayload` as the message
  const hmac = createHmac('sha512', webhookSecret); // webhookSecret is provided by shine
  hmac.update(signedPayload);
  const expectedSignature = hmac.digest('hex');

  // 4. Compare the signature in the header with the expected signature.
  return expectedSignature === signature;
};

// Mocking the database
export const writeToDb = (companyProfileId: string, webhooks: any[]) => {
  const dbName = `db-${companyProfileId}.json`;
  writeFileSync(dbName, JSON.stringify(webhooks));
};

export const readFromDb = (companyProfileId: string) => {
  const dbName = `db-${companyProfileId}.json`;
  if (!existsSync(dbName)) {
    writeFileSync(dbName, '[]');
    return [];
  }

  const db = readFileSync(dbName).toString();
  return JSON.parse(db);
};
