# Shine APIs

[![Code Owners](https://img.shields.io/badge/owner-platform-blueviolet?style=flat&logo=github)](./.github/CODEOWNERS)

This repo contains both examples for shine regulated partners api and shine public api

This projects aims at demonstrating how to use Shine Connect API, including the mTLS setup.

Not all routes are included, there is both a `GET` and `POST` that should be enough to get you started.

See the full Shine Connect documentation [here](https://developers.shine.fr/v3.1/reference).

## Install

```
yarn install
```

## Configuration

Copy `server/config/config.example.json` to a new `server/config/config.json` and fill the following values

| Variable       | Description                                                                                          |
| -------------- | ---------------------------------------------------------------------------------------------------- |
| CLIENT_ID      | Client ID given at the creation                                                                      |
| CLIENT_SECRET  | Secret given at the creation                                                                         |
| SCOPE          | Scope to be granted, will be presented to the user                                                   |
| REDIRECT_URI   | Redirect URI once authorization is granted. Make sure it is whitelisted in the client `redirectURIs` |
| WEBHOOK_SECRET | Secret provided by shine to check webhook signature                                                  |

# Shine connect for regulated partners (DSP2)

### Configuration QSEAL and QWAC for DSP2

Add the necessary certificates for mTLS connection:

- server/certificates/QSEAL_KEY.pem, it should contain your QSEAL key
- server/certificates/QWAC_KEY.pem, it should contain your QWAC key
- server/certificates/QWAC_CERT.pem, it should contain your QWAC certificate
- server/certificates/ROOT_CA.pem, it should contain the certificate chain of the root certificate(s) necessary to use you QWAC certificate

## Run

```
yarn dev
```

# Shine connect public api

- You need to export PUBLIC_API

```
export PUBLIC_API=true
```

- then we can run it

```
yarn dev
```
