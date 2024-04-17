import React, { useCallback, useState } from 'react';
import styled from 'styled-components';

import GetUserProfile from '../features/GetUserProfile';
import OperationOutput from '../components/OperationOutput';
import ErrorOutput from '../components/ErrorOutput';
import SignIn from './SignIn';
import { AuthenticatedData } from '../utils';
import GetCompanyProfile from '../features/GetCompanyProfile';
import GetBankAccounts from '../features/GetBankAccounts';
import GetTransactions from '../features/GetTransactions';
import GetTransactionById from '../features/GetTransactionById';
import GetReceiptForTransaction from '../features/GetReceiptForTransaction';
import GetReceiptById from '../features/GetReceiptById';
import GetReceiptForCompany from '../features/GetReceiptForCompany';
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import GetInvoicesForCompany from '../features/GetInvoicesForCompany';
import GetBankTransfers from '../features/GetBankTransfers';
import GetBankTransferById from '../features/GetBankTransferById';
import GetInvoiceById from '../features/GetInvoiceById';
import GetInvoiceMappings from '../features/GetInvoiceMappings';
import GetWebhooks from '../features/GetWebhooks';
import RefreshToken from '../features/RefreshToken';
import Button from '../components/Button';
import { useRouter } from 'next/router';

const Container = styled.div`
  display: flex;
  align-items: center;
  min-height: 100vh;
`;

const ContainerOutput = styled.div`
  flex-direction: row;
  height: 900px;
`;

const StyledSidebarHeader = styled.div`
  height: 32px;
  min-height: 32px;
  display: flex;
  align-items: center;
  padding: 0 20px;
  font-size: 1.4em;

  > div {
    width: 100%;
    overflow: hidden;
  }
`;

function GeneralInformations({ authenticatedData }: { authenticatedData: AuthenticatedData }) {
  const [operationOutput, setOperationOutput] = useState<string>(null);
  const [error, setError] = useState<string>(null);
  const router = useRouter();

  const goTo = useCallback(() => {
    router.push(router.asPath + '&page=bank');
  }, [router, authenticatedData]);

  if (!authenticatedData.authorized) {
    return <SignIn />;
  }

  return (
    <Container>
      <Sidebar width="500">
        <StyledSidebarHeader>General information</StyledSidebarHeader>
        <Menu>
          <GetUserProfile
            setOperationOutput={setOperationOutput}
            setError={setError}
            authenticatedData={authenticatedData}
          />
        </Menu>
        <Menu>
          <GetCompanyProfile
            setOperationOutput={setOperationOutput}
            setError={setError}
            authenticatedData={authenticatedData}
          />
        </Menu>
        <Menu>
          <RefreshToken
            setOperationOutput={setOperationOutput}
            setError={setError}
            authenticatedData={authenticatedData}
          />
        </Menu>

        <Menu>
          <Button key="bankAccount" text="Get bank accounts" onClick={goTo}></Button>
        </Menu>
      </Sidebar>
      <ContainerOutput>
        <OperationOutput operationOutput={operationOutput} />
        <ErrorOutput error={error} />
      </ContainerOutput>
    </Container>
  );
}

export default GeneralInformations;
