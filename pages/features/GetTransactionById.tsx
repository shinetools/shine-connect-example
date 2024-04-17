import React, { useCallback, useState } from 'react';
import Button from '../components/Button';
import axios, { AxiosError } from 'axios';
import { FeatureParams, SContainer, SInput, stringifyResponse } from '../utils';
import styled from 'styled-components';

const Container = styled.div`
  background-color: #f5f5f5;
  margin: 10px 0;
  padding-left: 40px;
  padding-right: 40px;
  border: 0;
  z-index: 1;
  border-radius: 20px;
  font-size: 16px;
`;

const Input = styled.input`
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    width: '100%',
    boxSizing: 'border-box',
    marginBottom: '10px',
    marginTop: '10px',

`;
function GetTransactionById({ authenticatedData, setOperationOutput, setError }: FeatureParams) {
  const [transactionId, setTransactionId] = useState('');

  const getTransactionById = useCallback(() => {
    setError(null);
    axios
      .get('/transaction-by-id', {
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
        placeholder="transaction id"
        size={40}
      />
      <Button key="transactionById" text="Get transaction by ID" onClick={getTransactionById} />
    </SContainer>
  );
}

export default GetTransactionById;
