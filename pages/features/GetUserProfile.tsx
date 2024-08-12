import React, { useCallback } from 'react';
import Button from '../components/Button';
import axios, { AxiosError } from 'axios';
import { FeatureParams, SContainer, stringifyResponse } from '../utils';

function GetUserProfile({ authenticatedData, setOperationOutput, setError }: FeatureParams) {
  const getUserProfile = useCallback(() => {
    setError(null);
    axios
      .get('/user-profile', {
        params: {
          uid: authenticatedData.uid,
          access_token: authenticatedData.access_token, // in real world scenario, this should be stored in a your backend
        },
      })
      .then((result) => setOperationOutput(stringifyResponse(result.data)))
      .catch((err: AxiosError) => setError(stringifyResponse(err.response.data)));
  }, [setError, setOperationOutput, authenticatedData]);

  return (
    <SContainer>
      <Button key="userProfile" text="Get user profile" onClick={getUserProfile} />
    </SContainer>
  );
}

export default GetUserProfile;
