import React, { useCallback } from 'react';
import Button from '../components/Button';
import axios, { AxiosError } from 'axios';
import { FeatureParams, SContainer, stringifyResponse } from '../utils';

function GetReceiptForCompany({ authenticatedData, setOperationOutput, setError }: FeatureParams) {
  const getReceiptForTransaction = useCallback(() => {
    setError(null);
    axios
      .get('/receipt-for-company', {
        params: {
          companyProfileId: authenticatedData.companyProfileId,
          access_token: authenticatedData.access_token, // in real world scenario, this should be stored in a your backend
        },
      })
      .then((result) => setOperationOutput(stringifyResponse(result.data)))
      .catch((err: AxiosError) => setError(stringifyResponse(err.response.data)));
  }, [setError, setOperationOutput, authenticatedData]);

  return (
    <SContainer>
      <Button key="receiptForCompany" text="Get receipt for given company" onClick={getReceiptForTransaction} />
    </SContainer>
  );
}

export default GetReceiptForCompany;
