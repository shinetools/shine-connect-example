import React, { useCallback, useState } from 'react';
import Button from '../components/Button';
import axios, { AxiosError } from 'axios';
import { FeatureParams, SContainer, SInput, stringifyResponse } from '../utils';

function CreateActionRequest({ authenticatedData, setOperationOutput, setError }: FeatureParams) {
  const [bankAccountId, setBankAccountId] = useState('');
  const [bankTransferRecipientId, setBankTransferRecipientId] = useState('');
  const [amount, setAmount] = useState('223');

  const createActionRequest = useCallback(() => {
    const { uid } = authenticatedData;
    setError(null);
    axios
      .get('/create-action-request', {
        params: {
          uid,
          bankTransferRecipientId,
          amount,
          bankAccountId,
          companyUserId: authenticatedData.companyUserId,
          access_token: authenticatedData.access_token, // in real world scenario, this should be stored in a your backend
        },
      })

      .then((result) => setOperationOutput(stringifyResponse(result.data)))
      .catch((err: AxiosError) => setError(stringifyResponse(err.response.data)));
  }, [setError, setOperationOutput, bankAccountId, authenticatedData, bankTransferRecipientId, amount]);

  return (
    <SContainer>
      <SInput
        value={bankAccountId}
        onChange={(e) => setBankAccountId(e.target.value)}
        type="text"
        placeholder="Bank account id"
        size={40}
      />
      <SInput
        value={bankTransferRecipientId}
        onChange={(e) => setBankTransferRecipientId(e.target.value)}
        type="text"
        placeholder="Bank transfer recipient id"
        size={40}
      />
      <SInput value={amount} onChange={(e) => setAmount(e.target.value)} type="number" placeholder="Amount" size={40} />

      <Button key="createTransfersRecipient" text="Create Transfers Recipient" onClick={createActionRequest} />
    </SContainer>
  );
}

export default CreateActionRequest;
