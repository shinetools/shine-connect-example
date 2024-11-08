import React, { useCallback } from 'react';
import Button from '../components/Button';
import axios, { AxiosError } from 'axios';
import { FeatureParams, SContainer, stringifyResponse } from '../utils';

function RefreshToken({ authenticatedData, setOperationOutput, setError }: FeatureParams) {
  const getWebhookEvent = useCallback(() => {
    setError(null);
    axios
      .get('/refresh-token', {
        params: {
          refresh_token: authenticatedData.refresh_token,
        },
      })

      .then((result) => setOperationOutput(stringifyResponse(result.data)))
      .catch((err: AxiosError) => setError(stringifyResponse(err.response.data)));
  }, [setError, setOperationOutput, authenticatedData]);

  return (
    <SContainer>
      <Button key="refreshToken" text="Refresh Token" onClick={getWebhookEvent} />
    </SContainer>
  );
}

export default RefreshToken;
