import { getHosts } from './getHosts';
import config from './config.json';
const {
  CLIENT_ID: clientId,
  CLIENT_SECRET: clientSecret,
  SCOPE: defaultScope,
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

const isPublicAPI = process.env.PUBLIC_API === 'true';

const port = process.env.PORT || 9876;
const dev = isLocal || isStaging;

const { shineApiHost, shineAuthHost } = getHosts(isLocal, isStaging, isPublicAPI);

export {
  shineAuthHost,
  shineApiHost,
  redirectUri,
  port,
  clientId,
  clientSecret,
  defaultScope,
  dev,
  isLocal,
  webhookSecret,
  keyId,
  qwacKeyPath,
  qwacCertPath,
  qsealKeyPath,
  rootCAPath,
  isPublicAPI,
};
