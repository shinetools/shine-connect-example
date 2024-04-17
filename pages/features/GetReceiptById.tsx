import React, { useCallback, useState } from 'react';
import Button from '../components/Button';
import axios, { AxiosError } from 'axios';
import { FeatureParams, SContainer, SInput, stringifyResponse } from '../utils';

function GetReceiptById({ authenticatedData, setOperationOutput, setError }: FeatureParams) {
  const [receiptId, setReceiptId] = useState('');

  const getReceiptById = useCallback(() => {
    setError(null);
    axios
      .get('/receipt-by-id', {
        params: {
          receiptId,
          access_token: authenticatedData.access_token, // in real world scenario, this should be stored in a your backend
        },
      })
      .then((result) => setOperationOutput(stringifyResponse(result.data)))
      .catch((err: AxiosError) => setError(stringifyResponse(err.response.data)));
  }, [setError, setOperationOutput, authenticatedData, receiptId]);

  return (
    <SContainer>
      <SInput
        value={receiptId}
        onChange={(e) => setReceiptId(e.target.value)}
        type="text"
        placeholder="Receipt id"
        size={40}
      />
      <Button key="receiptById" text="Get receipt by ID" onClick={getReceiptById} />
    </SContainer>
  );
}

export default GetReceiptById;
