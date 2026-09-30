import React, { useCallback, useState } from 'react';
import Button from '../components/Button';
import axios, { AxiosError } from 'axios';
import { FeatureParams, SContainer, SInput, stringifyResponse } from '../utils';

function GetTransfersRecipientById({ authenticatedData, setOperationOutput, setError }: FeatureParams) {
  const [transfersRecipientId, setTransfersRecipientId] = useState('');

  const getTransfersRecipientById = useCallback(() => {
    setError(null);
    axios
      .get('/transfers-recipient-by-id', {
        params: {
          transfersRecipientId: transfersRecipientId,
          access_token: authenticatedData.access_token, // in real world scenario, this should be stored in a your backend
        },
      })
      .then((result) => setOperationOutput(stringifyResponse(result.data)))
      .catch((err: AxiosError) => setError(stringifyResponse(err.response.data)));
  }, [setError, setOperationOutput, authenticatedData, transfersRecipientId]);

  return (
    <SContainer>
      <SInput
        value={transfersRecipientId}
        onChange={(e) => setTransfersRecipientId(e.target.value)}
        type="text"
        placeholder="transfers recipient id"
        size={40}
      />
      <Button key="transfersRecipientById" text="Get transfers recipient by ID" onClick={getTransfersRecipientById} />
    </SContainer>
  );
}

export default GetTransfersRecipientById;
