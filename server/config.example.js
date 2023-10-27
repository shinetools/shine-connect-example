const config = {
  CLIENT_ID: '',
  CLIENT_SECRET: '',
  SCOPE: '',
  REDIRECT_URI: '',
  QWAC_KEY_PATH: `${__dirname}/certificates/QWAC_KEY.pem`,
  QWAC_CERT_PATH: `${__dirname}/certificates/QWAC_CERT.pem`,
  QSEAL_KEY_PATH: `${__dirname}/certificates/QSEAL_KEY.pem`,
  ROOT_CA_PATH: `${__dirname}/certificates/CERTEUROPE_CA.pem`,
};

module.exports = config;
