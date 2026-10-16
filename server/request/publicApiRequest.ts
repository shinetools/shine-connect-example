import axios, { AxiosError } from 'axios';
import { shineApiHost, isLocal } from '../config';
import { convertObjectToString } from './index';

/**
 * This function is exclusively for the Shine development environment.
 * Its content will be automatically injected by the Shine load balancer,
 * so there is no action required from developers.
 */
const addLocalLoadBalancerHeaders = () => ({
  public_load_balancer: 'true',
  client_cert_present: 'false',
  client_cert_chain_verified: 'false',
});

export type DoRequestParams = { method: string; path: string; authorization: string; payload?: unknown };

export const publicApiRequest = async (params: DoRequestParams) => {
  const { method, path, authorization, payload } = params;
  const postData = convertObjectToString(payload);

  // Make the HTTPS request
  return axios
    .request({
      url: shineApiHost + path,
      method,
      headers: {
        ...(postData
          ? {
              'Content-Length': postData.length,
              'Content-Type': 'application/json',
            }
          : {}),
        ...(isLocal ? addLocalLoadBalancerHeaders() : {}), // This line is exclusively for the Shine development environment
        Authorization: `Bearer ${authorization}`,
      },
      data: payload,
    })
    .then((res) => {
      return {
        body: res.data,
        status: res.status,
      };
    })
    .catch((e: AxiosError) => {
      return {
        body: e.response?.data ?? { message: e.message },
        status: e.response?.status ?? 500,
      };
    });
};
