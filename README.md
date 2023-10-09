# Shine Connect

[![Code Owners](https://img.shields.io/badge/owner-platform-blueviolet?style=flat&logo=github)](./.github/CODEOWNERS)

A Shine Connect usage example.

See the full Shine Connect documentation [here](https://developers.shine.fr/v3.0/reference).

## Install

```
yarn install
```

## Usage

Copy `server/config.example.js` to a new `server/config.js` and fill the following values

| Variable      | Description                                                                                           |
| ------------- | ----------------------------------------------------------------------------------------------------- |
| CLIENT_ID     | Client ID given at the creation                                                                       |
| CLIENT_SECRET | Secret given at the creation                                                                          |
| SCOPE         | Scope to be granted, will be presented to the user                                                    |
| REDIRECT_URI  | Redirect URI once authorization is granted. Make sure it is whitelisted in the client `redirectURIs`` |

Add the necessary certificates for mTLS connection:

- `server/certificates/QWAC_KEY.pem`
- `server/certificates/QWAC_CERT.pem`

Then run

```
yarn run dev
```
