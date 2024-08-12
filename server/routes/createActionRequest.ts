import { Request, Response } from 'express';
import axios from 'axios';
import { clientId, clientSecret, shineAuthHost } from '../config';
import { shineRequest } from '../request';

const initiateActionRequest = async (
  uid: string,
  bankTransferRecipientId: string,
  amount: number,
  companyUserId: string,
  bankAccountId: string,
) => {
  try {
    const result = await axios.post<{ data: { authenticationActionRequestId: string } }>(
      `${shineAuthHost}/oauth2/action_request`,
      {
        action: 'bank:transfers:create',
        client_id: clientId,
        client_secret: clientSecret,
        uid,
        payload: {
          amount,
          bankTransferRecipientId,
          uid,
          companyUserId,
          bankAccountId,
        },
      },
    );
    console.log('Action request initiated 🚀', result.data);
    return result.data.data.authenticationActionRequestId;
  } catch (error) {
    console.log(error);
    return;
  }
};

const pollActionRequest = async (actionRequestId: string) => {
  try {
    const result = await axios.post<{ data: { status: string; token: string } }>(
      `${shineAuthHost}/oauth2/action_request/${actionRequestId}/poll`,
      {
        client_id: clientId,
        client_secret: clientSecret,
      },
    );
    console.log('Action request status 🔄', result.data);
    return result.data.data;
  } catch (error) {
    console.log(error);
    return;
  }
};

const executeActionRequest = async (
  res: Response,
  token: string,
  uid: string,
  bankTransferRecipientId: string,
  amount: number,
  access_token: string,
  companyUserId: string,
  bankAccountId: string,
) => {
  try {
    const data = await shineRequest({
      method: 'POST',
      path: `/bank/transfers`,
      authorization: access_token as string,
      shortLivedToken: token,
      payload: {
        amount,
        bankTransferRecipientId,
        uid,
        companyUserId,
        bankAccountId,
      },
    });
    console.log('Action request executed 🚀', data);
    res.status(200).send(data);
  } catch (error) {
    const message = error.body?.message || error.message;
    res.status(error.status).send({
      status: error.status,
      message,
    });
  }
};

const createActionRequest = async (req: Request, res: Response) => {
  const { uid, bankTransferRecipientId, amount, access_token, companyUserId, bankAccountId } = req.query;

  // initiate the action request
  let actionRequestId = await initiateActionRequest(
    uid as string,
    bankTransferRecipientId as string,
    Number(amount),
    companyUserId as string,
    bankAccountId as string,
  );
  if (!actionRequestId) {
    res.status(400).send({
      status: 400,
      message: 'Failed to initiate action request',
    });
    return;
  }

  // poll the action request until it's completed
  console.log('About to poll for 🚀', actionRequestId);
  let actionRequestStatus;
  while (true) {
    actionRequestStatus = await pollActionRequest(actionRequestId);
    if (actionRequestStatus.status === 'REJECTED') {
      res.status(400).send({
        status: 400,
        message: 'Action request rejected by End-User',
      });
      break;
    }

    if (actionRequestStatus.status === 'CONFIRMED') {
      break;
    }
    // sleep for 5 seconds
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }

  if (!actionRequestStatus) {
    res.status(400).send({
      status: 400,
      message: 'Failed to poll action request status',
    });
    return;
  }

  // execute the request with short live token
  const token = actionRequestStatus.token;
  return executeActionRequest(
    res,
    token,
    uid as string,
    bankTransferRecipientId as string,
    Number(amount),
    access_token as string,
    companyUserId as string,
    bankAccountId as string,
  );
};

export default createActionRequest;
