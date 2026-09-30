import { Request, Response } from 'express';
import axios from 'axios';
import { clientId, clientSecret, shineAuthHost } from '../config';
import { shineRequest } from '../request';

const ACTION_REQUEST_TIMEOUT_MS = 180_000;
const ACTION_REQUEST_POLL_INTERVAL_MS = 3_000;

type ActionRequestStatus = {
  status: 'PENDING' | 'CONFIRMED' | 'REJECTED';
  token?: string;
};

type CreatedActionRequest = {
  id: string;
  expiresAt?: string;
};

type TransferPayload = {
  amount: number;
  uid: string;
  companyUserId: string;
  bankAccountId: string;
  bankTransferRecipientId?: string;
  recipient?: { iban: string; name: string; bic: string };
  userLabel?: string;
};

type ActionRequestError = {
  status: number;
  message: string;
};

const getErrorResponse = (error: unknown): ActionRequestError => {
  if (axios.isAxiosError(error)) {
    const responseData = error.response?.data;
    const message =
      typeof responseData?.message === 'string' ? responseData.message : error.message || 'Shine request failed';
    return { status: error.response?.status ?? 502, message };
  }

  if (typeof error === 'object' && error !== null) {
    const candidate = error as {
      status?: unknown;
      message?: unknown;
      body?: { message?: unknown };
    };
    const status = typeof candidate.status === 'number' ? candidate.status : 502;
    const message =
      typeof candidate.body?.message === 'string'
        ? candidate.body.message
        : typeof candidate.message === 'string'
          ? candidate.message
          : 'Shine request failed';
    return { status, message };
  }

  return { status: 502, message: 'Shine request failed' };
};

const initiateActionRequest = async (payload: TransferPayload): Promise<CreatedActionRequest> => {
  const result = await axios.post<{
    data?: { authenticationActionRequestId?: string; expiresAt?: string };
    message?: string;
  }>(`${shineAuthHost}/oauth2/action_request`, {
    action: 'bank:transfers:create',
    client_id: clientId,
    client_secret: clientSecret,
    uid: payload.uid,
    payload,
  });

  const actionRequestId = result.data.data?.authenticationActionRequestId;
  if (!actionRequestId) {
    throw new Error(result.data.message || 'Shine did not return an action request ID.');
  }

  return { id: actionRequestId, expiresAt: result.data.data?.expiresAt };
};

const pollActionRequest = async (actionRequestId: string) => {
  const result = await axios.get<{ data?: ActionRequestStatus; message?: string }>(
    `${shineAuthHost}/oauth2/action_request/${encodeURIComponent(actionRequestId)}/poll`,
    {
      params: {
        client_id: clientId,
        client_secret: clientSecret,
      },
    },
  );

  if (!result.data.data?.status) {
    throw new Error(result.data.message || 'Shine returned an invalid action request status.');
  }
  return result.data.data;
};

const waitForConfirmation = async ({ id, expiresAt }: CreatedActionRequest) => {
  const expiryTimestamp = expiresAt ? Date.parse(expiresAt) : Number.NaN;
  const deadline = Number.isFinite(expiryTimestamp)
    ? Math.min(expiryTimestamp, Date.now() + ACTION_REQUEST_TIMEOUT_MS)
    : Date.now() + ACTION_REQUEST_TIMEOUT_MS;

  while (Date.now() < deadline) {
    const status = await pollActionRequest(id);
    if (status.status === 'CONFIRMED') {
      if (!status.token) {
        throw new Error('Shine confirmed the action request but did not return a short-lived token.');
      }
      return status.token;
    }
    if (status.status === 'REJECTED') {
      throw { status: 403, message: 'Transfer authorization was rejected by the end user.' };
    }
    if (status.status !== 'PENDING') {
      throw new Error(`Shine returned an unsupported action request status: ${status.status}`);
    }

    await new Promise((resolve) => setTimeout(resolve, ACTION_REQUEST_POLL_INTERVAL_MS));
  }

  throw {
    status: 408,
    message: 'Transfer authorization expired or timed out. Confirm it promptly in Shine and try again.',
  };
};

const createActionRequest = async (req: Request, res: Response) => {
  const {
    uid,
    bankTransferRecipientId,
    recipient,
    userLabel,
    amount,
    access_token,
    companyUserId,
    bankAccountId,
  } = req.body ?? {};
  const isNlTransfer = recipient !== undefined;

  if (
    typeof uid !== 'string' ||
    !uid.trim() ||
    typeof companyUserId !== 'string' ||
    !companyUserId.trim() ||
    typeof bankAccountId !== 'string' ||
    !bankAccountId.trim() ||
    typeof access_token !== 'string' ||
    !access_token.trim() ||
    typeof amount !== 'number' ||
    !Number.isFinite(amount) ||
    amount <= 0 ||
    (isNlTransfer &&
      (typeof recipient?.iban !== 'string' ||
        !recipient.iban.trim() ||
        typeof recipient?.name !== 'string' ||
        !recipient.name.trim() ||
        typeof recipient?.bic !== 'string' ||
        !recipient.bic.trim() ||
        typeof userLabel !== 'string' ||
        !userLabel.trim())) ||
    (!isNlTransfer && (typeof bankTransferRecipientId !== 'string' || !bankTransferRecipientId.trim()))
  ) {
    res.status(400).send({
      status: 400,
      message: isNlTransfer
        ? 'Provide uid, company user ID, bank account ID, amount, NL recipient IBAN/name/BIC, and a user label.'
        : 'Provide uid, recipient ID, company user ID, bank account ID, access token, and a positive amount.',
    });
    return;
  }

  const transferPayload = {
    amount,
    uid: uid.trim(),
    companyUserId: companyUserId.trim(),
    bankAccountId: bankAccountId.trim(),
    ...(isNlTransfer
      ? {
          recipient: {
            iban: recipient.iban.trim(),
            name: recipient.name.trim(),
            bic: recipient.bic.trim(),
          },
          userLabel: userLabel.trim(),
        }
      : { bankTransferRecipientId: bankTransferRecipientId.trim() }),
  };

  try {
    const actionRequest = await initiateActionRequest(transferPayload);
    const shortLivedToken = await waitForConfirmation(actionRequest);
    const transfer = await shineRequest({
      method: 'POST',
      path: '/bank/transfers',
      authorization: access_token,
      shortLivedToken,
      payload: transferPayload,
    });
    res.status(200).send(transfer);
  } catch (error) {
    const { status, message } = getErrorResponse(error);
    res.status(status).send({ status, message });
  }
};

export default createActionRequest;
