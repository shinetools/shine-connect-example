import styled from 'styled-components';

const Code = styled.pre`
  background: #eee;
  padding: 20px;
`;
const OperationOutputDiv = styled.div`
  padding: 5px;
  border-top: 1px solid grey;
`;

function OperationOutput({ operationOutput }) {
  if (!operationOutput) {
    return null;
  }
  return (
    <OperationOutputDiv key="operationOutput">
      <em>Operation output</em>
      <Code>{operationOutput}</Code>
    </OperationOutputDiv>
  );
}

export default OperationOutput;
