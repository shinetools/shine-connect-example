import config from './config.json';

const SHINE_AUTHENTICATION_PRODUCTION_URL = 'https://api.shine.fr/v2/authentication';
const SHINE_AUTHENTICATION_STAGING_URL = 'https://api.staging.shine.fr/v2/authentication';

const SHINE_CONNECT_PRODUCTION_HOST = 'connect.api.shine.fr';
const SHINE_CONNECT_STAGING_HOST = 'connect.api.staging.shine.fr';
const SHINE_CONNECT_DEV_HOST = 'localhost';
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

const port = process.env.PORT || 9876;
const dev = process.env.NODE_ENV !== 'production';

const shineAuthHost = dev ? SHINE_AUTHENTICATION_STAGING_URL : SHINE_AUTHENTICATION_PRODUCTION_URL;
const shineApiHost = isLocal
  ? SHINE_CONNECT_DEV_HOST
  : isStaging
    ? SHINE_CONNECT_STAGING_HOST
    : SHINE_CONNECT_PRODUCTION_HOST;
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
};
