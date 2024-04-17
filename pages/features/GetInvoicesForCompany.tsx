import React, { useCallback } from 'react';
import Button from '../components/Button';
import axios, { AxiosError } from 'axios';
import { FeatureParams, SContainer, stringifyResponse } from '../utils';

function GetInvoicesForCompany({ authenticatedData, setOperationOutput, setError }: FeatureParams) {
  const getInvoicesForCompany = useCallback(() => {
    setError(null);
    axios
      .get('/invoices-for-company', {
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
      <Button key="invoicesForCompany" text="Get invoices for given company" onClick={getInvoicesForCompany} />
    </SContainer>
  );
}

export default GetInvoicesForCompany;
