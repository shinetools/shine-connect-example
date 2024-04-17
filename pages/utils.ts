import { Dispatch } from 'react';
import styled from 'styled-components';

export type AuthenticatedData = {
  access_token: string;
  authorized: string;
  companyProfileId: string;
  companyUserId: string;
  refresh_token: string;
  uid: string;
  page?: string;
};

export type FeatureParams = {
  authenticatedData: AuthenticatedData;
  setOperationOutput: Dispatch<string>;
  setError: Dispatch<string>;
};

export const stringifyResponse = (data: unknown) => JSON.stringify(data, null, 2);

export const SInput = styled.input`
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
  box-sizing: border-box;

  border: none;
  border-bottom: 0.5px solid #bdbdbd;

  font-size: 1.1em;
  padding-left: 0.25em;
  padding-top: 0.25em;
  min-width: 15em;

  :focus {
    border-color: #5eaefe;
    outline: none;
  }
`;

export const SContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;
