const crypto = require('crypto');

/**
  Generates a cryptographic digest using the SHA256 algorithm
  and a private key to sign it in base64 encoding.
  @param {string} body
  @param {string | Buffer} privateKek
  @returns {string} - The signed hash in base64 encoding.
*/
const generateDigest = (body, privateKey) => {
  const sign = crypto.createSign('SHA256');
  sign.write(body);
  sign.end();
  return sign.sign(privateKey, 'base64');
};

module.exports = {
  generateDigest,
};
