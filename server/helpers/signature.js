const crypto = require('crypto');

/**
  Validates the signature of a cryptographic digest using the SHA256 algorithm and a public key.
  @param {string} body
  @param {string} signature - The signed hash in base64 encoding.
  @param {string | Buffer} publicKey
  @returns {boolean} - Whether or not the signature is valid.
*/
const validateSignature = (body, signature, shinePublicKey) => {
  const verify = crypto.createVerify('SHA256');
  verify.write(body);
  verify.end();
  return verify.verify(shinePublicKey, signature, 'base64');
};

module.exports = { validateSignature };
