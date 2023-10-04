import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Action = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 50px;
  padding-left: 40px;
  padding-right: 40px;
  border: 0;
  z-index: 1;
  border-radius: 60px;
  font-size: 16px;
  cursor: pointer;
  background-color: #5465fc;
  color: white;
  transition: all 200ms;
  box-shadow: 0 2px 8px 2px rgba(84, 101, 252, 0.2);
  text-decoration: none;
  &:hover {
    background-color: #5e6dfd;
  }
  &:focus {
    outline: 'none';
  }
`;

const Link = Action.withComponent('a');

const Text = styled.span``;

function Button({ text, onClick, to }) {
  const Container = to ? Link : Action;
  return (
    <Container onClick={onClick} href={to}>
      <Text>{text}</Text>
    </Container>
  );
}

Button.defaultProps = {
  text: '',
  onClick: () => null,
  to: '',
};

Button.propTypes = {
  text: PropTypes.string,
  onClick: PropTypes.func,
  to: PropTypes.string,
};

export default Button;
