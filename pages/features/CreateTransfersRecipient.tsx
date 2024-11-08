import React, { useCallback, useState } from 'react';
import Button from '../components/Button';
import axios, { AxiosError } from 'axios';
import { FeatureParams, SContainer, SInput, stringifyResponse } from '../utils';

function CreateTransfersRecipient({ authenticatedData, setOperationOutput, setError }: FeatureParams) {
  const [iban, setIban] = useState('');
  const [swiftBic, setSwiftBic] = useState('');
  const [name, setName] = useState('');

  const createTransfersRecipient = useCallback(() => {
    const { access_token, companyProfileId, companyUserId, uid } = authenticatedData;
    setError(null);
    axios
      .get('/create-transfers-recipient', {
        params: {
          companyProfileId,
          companyUserId,
          uid,
          access_token, // in real world scenario, this should be stored in a your backend
          iban,
          swiftBic,
          name,
        },
      })

      .then((result) => setOperationOutput(stringifyResponse(result.data)))
      .catch((err: AxiosError) => setError(stringifyResponse(err.response.data)));
  }, [setError, setOperationOutput, authenticatedData, iban, swiftBic, name]);

  return (
    <SContainer>
      <SInput value={iban} onChange={(e) => setIban(e.target.value)} type="text" placeholder="iban" size={40} />
      <SInput
        value={swiftBic}
        onChange={(e) => setSwiftBic(e.target.value)}
        type="text"
        placeholder="swiftBic"
        size={40}
      />
      <SInput value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="name" size={40} />

      <Button key="createTransfersRecipient" text="Create Transfers Recipient" onClick={createTransfersRecipient} />
    </SContainer>
  );
}

export default CreateTransfersRecipient;
