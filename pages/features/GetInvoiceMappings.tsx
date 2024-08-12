import React, { useCallback, useState } from 'react';
import Button from '../components/Button';
import axios, { AxiosError } from 'axios';
import { FeatureParams, SContainer, SInput, stringifyResponse } from '../utils';

function GetInvoiceMappings({ authenticatedData, setOperationOutput, setError }: FeatureParams) {
  const [invoiceId, setInvoiceId] = useState('');

  const getInvoiceMappings = useCallback(() => {
    setError(null);
    axios
      .get('/invoice-mappings', {
        params: {
          invoiceId,
          access_token: authenticatedData.access_token, // in real world scenario, this should be stored in a your backend
        },
      })
      .then((result) => setOperationOutput(stringifyResponse(result.data)))
      .catch((err: AxiosError) => setError(stringifyResponse(err.response.data)));
  }, [setError, setOperationOutput, authenticatedData, invoiceId]);

  return (
    <SContainer>
      <SInput
        value={invoiceId}
        onChange={(e) => setInvoiceId(e.target.value)}
        type="text"
        placeholder="Invoice id"
        size={40}
      />

      <Button key="invoice-mapping" text="Get invoice mappings" onClick={getInvoiceMappings} />
    </SContainer>
  );
}

export default GetInvoiceMappings;
