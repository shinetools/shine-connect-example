import { isPublicAPI } from '../config';
import { publicApiRequest } from './publicApiRequest';
import { regulatedRequest } from './regulatedRequest';

export const shineRequest = isPublicAPI ? publicApiRequest : regulatedRequest;

export const convertObjectToString = (payload: unknown) => {
  if (!payload) return null;
  try {
    const postData = JSON.stringify(payload);
    return postData;
  } catch (error) {
    throw error;
  }
};
