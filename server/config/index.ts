import { getHosts } from './getHosts';
import config from './config.json';
import { dsp2Scopes, publicApiScopes } from './scopes';

const {
  PSD2_REGULATION: psd2Regulation,
  CLIENT_ID: clientId,
  CLIENT_SECRET: clientSecret,
  SCOPE: clientScopes,
  REDIRECT_URI: redirectUri,
  WEBHOOK_SECRET: webhookSecret,
  KEY_ID: keyId,
  QWAC_KEY_PATH: qwacKeyPath,
  QWAC_CERT_PATH: qwacCertPath,
  QSEAL_KEY_PATH: qsealKeyPath,
  ROOT_CA_PATH: rootCAPath,
} = config;

const isStaging = process.env.API_ENV === 'staging';
const isProd = process.env.API_ENV === 'production';
const isLocal = !isProd && !isStaging;

const isPublicAPI = psd2Regulation === false;

const port = process.env.PORT || 9876;
const dev = isLocal || isStaging;

const { shineApiHost, shineAuthHost } = getHosts(isLocal, isStaging, isPublicAPI);

const availableScopes = isPublicAPI ? publicApiScopes : dsp2Scopes;

export {
  shineAuthHost,
  shineApiHost,
  redirectUri,
  port,
  clientId,
  clientSecret,
  clientScopes,
  availableScopes,
  dev,
  isLocal,
  isPublicAPI,
  webhookSecret,
  keyId,
  qwacKeyPath,
  qwacCertPath,
  qsealKeyPath,
  rootCAPath,
};
