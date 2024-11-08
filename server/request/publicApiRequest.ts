import axios, { AxiosError } from 'axios';
import { shineApiHost, isLocal } from '../config';

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
export const convertObjectToString = (payload: unknown) => {
  if (!payload) return null;
  try {
    const postData = JSON.stringify(payload);
    return postData;
  } catch (error) {
    throw error;
  }
};

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
        body: e.response.data,
        status: e.response.status,
      };
    });
};
