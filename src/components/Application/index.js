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

const Application = ({
  authorized, refreshToken, hasBeenRefreshed, hasRefreshFailed,
}) => (
  <Container>
    <Head>
      <title>Shine Connect</title>
    </Head>
    {authorized === null ? (
      <Button text="Login with Shine" to="/shine-connect" />
    ) : authorized === false ? (
      <Refused>
        Authorization request denied <Emoji name="disappointed" emoji="😞" />
      </Refused>
    ) : (
      [
        <Accepted key="accepted">
          Authorization request accepted <Emoji name="tada" emoji="🎉" />
        </Accepted>,
        <Button key="refresh" text="Refresh token" onClick={refreshToken} />,
        hasBeenRefreshed && (
          <Accepted key="refreshed">
            Token refreshed <Emoji name="repeat" emoji="🔁" />
          </Accepted>
        ),
        hasRefreshFailed && (
          <Refused key="failed">
            Token has not been refreshed <Emoji name="sob" emoji="😭" />
          </Refused>
        ),
      ]
    )}
  </Container>
);

Application.defaultProps = {
  authorized: null,
  hasBeenRefreshed: false,
  hasRefreshFailed: false,
};

Application.propTypes = {
  authorized: PropTypes.bool,
  refreshToken: PropTypes.func.isRequired,
  hasBeenRefreshed: PropTypes.bool,
  hasRefreshFailed: PropTypes.bool,
};

export default Application;
