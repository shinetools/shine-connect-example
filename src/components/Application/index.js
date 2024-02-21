import PropTypes from 'prop-types';
import Head from 'next/head';
import styled from 'styled-components';
import Button from '../Button';
import Emoji from '../Emoji';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
`;

const Text = styled.div``;

const Accepted = Text.extend`
  color: #0dca9c;
`;

const Refused = Text.extend`
  color: #ff3d36;
`;

const OperationOuput = styled.div`
  padding: 5px;
  border-top: 1px solid grey;
`;

const Code = styled.pre`
  background: #eee;
  padding: 20px;
  max-width: 700px;
  overflow: scroll;
`;

const Error = OperationOuput.extend``;
const ErrorCode = Code.extend`
  background: #faa0a0;
`;

function Application({
  authorized,
  refreshToken,
  hasBeenRefreshed,
  hasRefreshFailed,
  operationOutput,
  error,
  getBankAccounts,
  getInvoices,
  createBankTransferRecipient,
  getBankTransferRecipients,
}) {
  return (
    <Container>
      <Head>
        <title>Shine Connect</title>
      </Head>
      {authorized === null ? (
        <Button text="Login with Shine" to="/shine-connect" />
      ) : authorized === false ? (
        <Refused>
          Authorization request denied
          <Emoji name="disappointed" emoji="😞" />
        </Refused>
      ) : (
        [
          <Accepted key="accepted">
            Authorization request accepted
            <Emoji name="tada" emoji="🎉" />
          </Accepted>,
          <Button key="refresh" text="Refresh token" onClick={refreshToken} />,
          <Button
            key="bankAccounts"
            text="Get bank accounts"
            onClick={getBankAccounts}
          />,
          <Button
            key="createBankTransferRecipient"
            text="Create a bank transfer recipient"
            onClick={createBankTransferRecipient}
          />,
          <Button
            key="getBankTransferRecipients"
            text="Get bank transfer recipients"
            onClick={getBankTransferRecipients}
          />,
          <Button
            key="getInvoices"
            text="Get invoices"
            onClick={getInvoices}
          />,
          hasBeenRefreshed && (
            <Accepted key="refreshed">
              Token refreshed
              <Emoji name="repeat" emoji="🔁" />
            </Accepted>
          ),
          hasRefreshFailed && (
            <Refused key="failed">
              Token has not been refreshed
              <Emoji name="sob" emoji="😭" />
            </Refused>
          ),
          operationOutput && (
            <OperationOuput key="operationOutput">
              <em>Operation output</em>
              <Code>{operationOutput}</Code>
            </OperationOuput>
          ),
          error && (
            <Error key="error">
              <em>Error</em>
              <ErrorCode>{error}</ErrorCode>
            </Error>
          ),
        ]
      )}
    </Container>
  );
}

Application.defaultProps = {
  authorized: null,
  hasBeenRefreshed: false,
  hasRefreshFailed: false,
  operationOutput: null,
  error: null,
};

Application.propTypes = {
  authorized: PropTypes.bool,
  refreshToken: PropTypes.func.isRequired,
  getBankAccounts: PropTypes.func.isRequired,
  getInvoices: PropTypes.func.isRequired,
  getBankTransferRecipients: PropTypes.func.isRequired,
  createBankTransferRecipient: PropTypes.func.isRequired,
  hasBeenRefreshed: PropTypes.bool,
  hasRefreshFailed: PropTypes.bool,
  operationOutput: PropTypes.string,
  error: PropTypes.string,
};

export default Application;
