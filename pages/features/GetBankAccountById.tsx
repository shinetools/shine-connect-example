import React, { useCallback, useState } from 'react';
import Button from '../components/Button';
import axios, { AxiosError } from 'axios';
import { FeatureParams, SContainer, SInput, stringifyResponse } from '../utils';

function GetBankAccountById({ authenticatedData, setOperationOutput, setError }: FeatureParams) {
  const [bankAccountId, setBankAccountId] = useState('');

  const getBankAccountById = useCallback(() => {
    setError(null);
    axios
      .get('/bank-account-by-id', {
        params: {
          bankAccountId,
          access_token: authenticatedData.access_token, // in real world scenario, this should be stored in a your backend
        },
      })
      .then((result) => setOperationOutput(stringifyResponse(result.data)))
      .catch((err: AxiosError) => setError(stringifyResponse(err.response.data)));
  }, [setError, setOperationOutput, authenticatedData, bankAccountId]);

  return (
    <SContainer>
      <SInput
        value={bankAccountId}
        onChange={(e) => setBankAccountId(e.target.value)}
        type="text"
        placeholder="Bank account id"
        size={40}
      />

      <Button key="bank-account-by-id" text="Get bank account by Id " onClick={getBankAccountById} />
    </SContainer>
  );
}

export default GetBankAccountById;
