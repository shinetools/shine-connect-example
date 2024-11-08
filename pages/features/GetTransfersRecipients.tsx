import React, { useCallback } from 'react';
import Button from '../components/Button';
import axios, { AxiosError } from 'axios';
import { FeatureParams, SContainer, stringifyResponse } from '../utils';

function GetTransfersRecipients({ authenticatedData, setOperationOutput, setError }: FeatureParams) {
  const getTransfersRecipients = useCallback(() => {
    setError(null);
    axios
      .get('/transfers-recipients', {
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
      <Button key="transfersRecipients" text="Get Transfers Recipients" onClick={getTransfersRecipients} />
    </SContainer>
  );
}

export default GetTransfersRecipients;
