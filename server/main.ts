import next from 'next';
import express from 'express';
import url from 'url';

import { redirectUri, port, dev } from './config';
import * as config from './config';
import login from './login';
import callback from './callback';
import getUserProfile from './routes/userProfile';
import getCompanyProfile from './routes/companyProfile';
import getBankAccounts from './routes/bankAccounts';
import getTransactions from './routes/transactions';
import getTransactionById from './routes/transactionById';
import getReceiptForTransaction from './routes/receiptForTransaction';
import getReceiptById from './routes/receiptById';
import getReceiptForCompany from './routes/receiptForCompany';
import getBankTransfers from './routes/bankTransfers';
import getBankTransferById from './routes/bankTransferById';
import getInvoiceById from './routes/invoiceById';
import getInvoiceMapping from './routes/invoiceMapping';
import webhookHandler from './routes/webhookHandler';
import webhook from './routes/webhook';
import refreshToken from './routes/refreshToken';
import { rawBodySaver } from './webhookUtils';
import createTransfersRecipient from './routes/createTransfersRecipient';
import getTransfersRecipientById from './routes/transfersRecipientById';
import getTransfersRecipients from './routes/transfersRecipients';
import createActionRequest from './routes/createActionRequest';
import getInvoicesForCompany from './routes/invoicesForCompany';

const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();
  // This is required to parse the request body as raw to check the signature
  server.use(express.json({ verify: rawBodySaver }));
  console.log('Loaded configuration', config);

  const redirectUriPath = url.parse(redirectUri).pathname;

  server.get('/login', login);
  server.get(redirectUriPath, callback);
  server.get('/refresh-token', refreshToken);

  server.get('/user-profile', getUserProfile);
  server.get('/company-profile', getCompanyProfile);
  server.get('/bank-accounts', getBankAccounts);
  server.get('/bank-transfers', getBankTransfers);
  server.get('/bank-transfer-by-id', getBankTransferById);
  server.get('/transactions', getTransactions);
  server.get('/transaction-by-id', getTransactionById);
  server.get('/receipt-for-transaction', getReceiptForTransaction);
  server.get('/receipt-for-company', getReceiptForCompany);
  server.get('/receipt-by-id', getReceiptById);
  server.get('/invoices-for-company', getInvoicesForCompany);
  server.get('/invoice-by-id', getInvoiceById);
  server.get('/invoice-mappings', getInvoiceMapping);

  // Regulated Partner
  server.get('/create-transfers-recipient', createTransfersRecipient);
  server.get('/transfers-recipient-by-id', getTransfersRecipientById);
  server.get('/transfers-recipients', getTransfersRecipients);
  server.get('/create-action-request', createActionRequest);

  // Webhook routes
  server.post('/webhook-handler', webhookHandler);
  server.get('/webhook', webhook);

  server.get('*', (req, res) => handle(req, res));
  server.listen(port, () => console.info(`Server listening on port ${port}`));
});
