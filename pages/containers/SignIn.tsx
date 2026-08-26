import qs from 'qs';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import Head from 'next/head';

import { useState } from 'react';
import Button from '../components/Button';
import ScopeList from '../components/ScopeList';
import { dsp2Scopes, minimalScopes, publicApiScopes } from '../../server/config/scopes';
import { isPublicAPI } from '../../server/config';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
`;

const H2 = styled.h2`
  margin-bottom: 20px;
`;

function SignIn({isPublicAPI}: {isPublicAPI: boolean}) {
  const router = useRouter();
  const [selectedValues, setSelectedValues] = useState(minimalScopes);

  const scopes = isPublicAPI ? publicApiScopes : dsp2Scopes;

  const handleSelectedValuesChange = (newSelectedValues: string[]) => {
    setSelectedValues(newSelectedValues);
  };

  const handleLogin = () => {
    router.push(`/login?${qs.stringify({ requestedScope: selectedValues.join(' ') })}`);
  };

  return (
    <Container>
      <Head>
        <title>Shine Connect</title>
      </Head>
      <H2>Select scope that you want to access</H2>
      <ScopeList values={scopes} selectedValues={selectedValues} onSelectedValuesChange={handleSelectedValuesChange} />
      <Button text="Login with Shine" onClick={handleLogin} />
    </Container>
  );
}

export default SignIn;
