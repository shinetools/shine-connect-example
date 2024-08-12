import styled from 'styled-components';

const Error = styled.div`
  padding: 5px;
  border-top: 1px solid grey;
`;

const ErrorCode = styled.div`
  background: #faa0a0;
  padding: 20px;
`;

function ErrorOutput({ error }) {
  if (error) {
    return (
      <Error key="error">
        <em>Error</em>
        <ErrorCode>{error}</ErrorCode>
      </Error>
    );
  }
  return null;
}

export default ErrorOutput;
