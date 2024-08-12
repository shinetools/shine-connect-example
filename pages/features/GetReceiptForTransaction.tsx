import React, { useCallback, useState } from 'react';
import Button from '../components/Button';
import axios, { AxiosError } from 'axios';
import { FeatureParams, SContainer, SInput, stringifyResponse } from '../utils';
import styled from 'styled-components';

function GetReceiptForTransaction({ authenticatedData, setOperationOutput, setError }: FeatureParams) {
  const [transactionId, setTransactionId] = useState('');

  const getReceiptForTransaction = useCallback(() => {
    setError(null);
    axios
      .get('/receipt-for-transaction', {
        params: {
          transactionId,
          access_token: authenticatedData.access_token, // in real world scenario, this should be stored in a your backend
        },
      })
      .then((result) => setOperationOutput(stringifyResponse(result.data)))
      .catch((err: AxiosError) => setError(stringifyResponse(err.response.data)));
  }, [setError, setOperationOutput, authenticatedData, transactionId]);

  return (
    <SContainer>
      <SInput
        value={transactionId}
        onChange={(e) => setTransactionId(e.target.value)}
        type="text"
        placeholder="Transaction id"
        size={40}
      />
      <Button key="receiptForTransaction" text="Get receipt For Given transaction" onClick={getReceiptForTransaction} />
    </SContainer>
  );
}

export default GetReceiptForTransaction;
