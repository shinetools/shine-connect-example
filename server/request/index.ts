import { isPublicAPI } from '../config';
import { publicApiRequest } from './publicApiRequest';
import { regulatedRequest } from './regulatedRequest';

export const shineRequest = isPublicAPI ? publicApiRequest : regulatedRequest;
