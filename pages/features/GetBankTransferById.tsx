import React, { useCallback, useState } from 'react';
import Button from '../components/Button';
import axios, { AxiosError } from 'axios';
import { FeatureParams, SContainer, SInput, stringifyResponse } from '../utils';

function GetBankTransferById({ authenticatedData, setOperationOutput, setError }: FeatureParams) {
  const [bankTransferId, setBankTransferId] = useState('');

  const getBankTransferById = useCallback(() => {
    setError(null);
    axios
      .get('/bank-transfer-by-id', {
        params: {
          bankTransferId,
          access_token: authenticatedData.access_token, // in real world scenario, this should be stored in a your backend
        },
      })
      .then((result) => setOperationOutput(stringifyResponse(result.data)))
      .catch((err: AxiosError) => setError(stringifyResponse(err.response.data)));
  }, [setError, setOperationOutput, authenticatedData, bankTransferId]);

  return (
    <SContainer>
      <SInput
        value={bankTransferId}
        onChange={(e) => setBankTransferId(e.target.value)}
        type="text"
        placeholder="Bank transfer id"
        size={40}
      />

      <Button key="bank-transfers-by-id" text="Get bank transfer by Id " onClick={getBankTransferById} />
    </SContainer>
  );
}

export default GetBankTransferById;
