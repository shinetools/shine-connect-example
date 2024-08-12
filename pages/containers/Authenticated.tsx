import React, { useState } from 'react';
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
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import GetInvoicesForCompany from '../features/GetInvoicesForCompany';
import GetBankTransfers from '../features/GetBankTransfers';
import GetBankTransferById from '../features/GetBankTransferById';
import GetInvoiceById from '../features/GetInvoiceById';
import GetInvoiceMappings from '../features/GetInvoiceMappings';
import GetWebhooks from '../features/GetWebhooks';
import RefreshToken from '../features/RefreshToken';
import CreateTransfersRecipient from '../features/CreateTransfersRecipient';
import GetTransfersRecipients from '../features/GetTransfersRecipients';
import GetTransfersRecipientById from '../features/GetTransfersRecipientById';
import CreateActionRequest from '../features/CreateActionRequest';

const Container = styled.div`
  display: flex;
  align-items: center;
  min-height: 100vh;
  flex-direction: row;
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

function Authenticated({ authenticatedData }: { authenticatedData: AuthenticatedData }) {
  const [operationOutput, setOperationOutput] = useState<string>(null);
  const [error, setError] = useState<string>(null);

  if (!authenticatedData.authorized) {
    return <SignIn />;
  }

  return (
    <Container>
      <Sidebar width="500">
        <Menu>
          <SubMenu label={<StyledSidebarHeader>General information</StyledSidebarHeader>} defaultOpen={true}>
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
          </SubMenu>
        </Menu>
        <Menu>
          <SubMenu label={<StyledSidebarHeader>Bank information</StyledSidebarHeader>}>
            <Menu>
              <GetBankAccounts
                setOperationOutput={setOperationOutput}
                setError={setError}
                authenticatedData={authenticatedData}
              />
            </Menu>

            <StyledSidebarHeader>Transactions </StyledSidebarHeader>
            <Menu>
              <GetTransactions
                setOperationOutput={setOperationOutput}
                setError={setError}
                authenticatedData={authenticatedData}
              />
            </Menu>
            <Menu>
              <GetTransactionById
                setOperationOutput={setOperationOutput}
                setError={setError}
                authenticatedData={authenticatedData}
              />
            </Menu>
          </SubMenu>
        </Menu>

        <Menu>
          <SubMenu label={<StyledSidebarHeader>Bank Transfers Information</StyledSidebarHeader>}>
            <Menu>
              <GetBankTransfers
                setOperationOutput={setOperationOutput}
                setError={setError}
                authenticatedData={authenticatedData}
              />
            </Menu>

            <Menu>
              <GetBankTransferById
                setOperationOutput={setOperationOutput}
                setError={setError}
                authenticatedData={authenticatedData}
              />
            </Menu>
          </SubMenu>
        </Menu>

        <Menu>
          <SubMenu label={<StyledSidebarHeader>Bank Transfer Recipients</StyledSidebarHeader>}>
            <Menu>
              <CreateTransfersRecipient
                setOperationOutput={setOperationOutput}
                setError={setError}
                authenticatedData={authenticatedData}
              />
            </Menu>

            <Menu>
              <GetTransfersRecipients
                setOperationOutput={setOperationOutput}
                setError={setError}
                authenticatedData={authenticatedData}
              />
            </Menu>
            <Menu>
              <GetTransfersRecipientById
                setOperationOutput={setOperationOutput}
                setError={setError}
                authenticatedData={authenticatedData}
              />
            </Menu>
          </SubMenu>
        </Menu>
        <Menu>
          <SubMenu label={<StyledSidebarHeader>Action Request </StyledSidebarHeader>}>
            <Menu>
              <CreateActionRequest
                setOperationOutput={setOperationOutput}
                setError={setError}
                authenticatedData={authenticatedData}
              />
            </Menu>
          </SubMenu>
        </Menu>
        <Menu>
          <SubMenu label={<StyledSidebarHeader>Receipts </StyledSidebarHeader>}>
            <Menu>
              <GetReceiptForCompany
                setOperationOutput={setOperationOutput}
                setError={setError}
                authenticatedData={authenticatedData}
              />
            </Menu>
            <Menu>
              <GetReceiptForTransaction
                setOperationOutput={setOperationOutput}
                setError={setError}
                authenticatedData={authenticatedData}
              />
            </Menu>
            <Menu>
              <GetReceiptById
                setOperationOutput={setOperationOutput}
                setError={setError}
                authenticatedData={authenticatedData}
              />
            </Menu>
          </SubMenu>
        </Menu>

        <Menu>
          <SubMenu label={<StyledSidebarHeader> Invoices </StyledSidebarHeader>}>
            <Menu>
              <GetInvoicesForCompany
                setOperationOutput={setOperationOutput}
                setError={setError}
                authenticatedData={authenticatedData}
              />
            </Menu>
            <Menu>
              <GetInvoiceById
                setOperationOutput={setOperationOutput}
                setError={setError}
                authenticatedData={authenticatedData}
              />
            </Menu>
            <Menu>
              <GetInvoiceMappings
                setOperationOutput={setOperationOutput}
                setError={setError}
                authenticatedData={authenticatedData}
              />
            </Menu>
          </SubMenu>
        </Menu>

        <Menu>
          <SubMenu label={<StyledSidebarHeader>Webhooks </StyledSidebarHeader>}>
            <Menu>
              <GetWebhooks
                setOperationOutput={setOperationOutput}
                setError={setError}
                authenticatedData={authenticatedData}
              />
            </Menu>
          </SubMenu>
        </Menu>
      </Sidebar>
      <ContainerOutput>
        <OperationOutput operationOutput={operationOutput} />
        <ErrorOutput error={error} />
      </ContainerOutput>
    </Container>
  );
}

export default Authenticated;
