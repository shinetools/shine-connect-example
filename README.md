# Shine APIs

[![Code Owners](https://img.shields.io/badge/owner-platform-blueviolet?style=flat&logo=github)](./.github/CODEOWNERS)

## Purpose
This repo contains both examples for Regulated partners and the public API

This projects aims at demonstrating how to use Shine Connect API, including the mTLS setup.

Not all routes are included, there is both a `GET` and `POST` that should be enough to get you started.

See the full Shine Connect documentation [here](https://developers.shine.fr/v3.1/reference).

## Install

```shell
yarn install
```

## General configuration

Copy `server/config/config.example.json` to a new `server/config/config.json` and fill the following values

| Variable        | Description                                                                                          |
|-----------------|------------------------------------------------------------------------------------------------------|
| PSD2_REGULATION | Whether you are subject to PSD2 regulation                                                           |
| CLIENT_ID       | Client ID given at the creation                                                                      |
| CLIENT_SECRET   | Secret given at the creation                                                                         |
| SCOPE           | Scope to be granted, will be presented to the user                                                   |
| REDIRECT_URI    | Redirect URI once authorization is granted. Make sure it is whitelisted in the client `redirectURIs` |
| WEBHOOK_SECRET  | Secret provided by shine to check webhook signature (optional)                                       |

#  Shine Connect for Regulated partners (DSP2)

### Configuration QSEAL and QWAC for DSP2

Add the necessary certificates for mTLS connection:

- `server/certificates/QSEAL_KEY.pem`, it should contain your QSEAL key
- `server/certificates/QWAC_KEY.pem`, it should contain your QWAC key
- `server/certificates/QWAC_CERT.pem`, it should contain your QWAC certificate
- `server/certificates/ROOT_CA.pem`, it should contain the certificate chain of the root certificate(s) necessary to use your QWAC certificate

##  Run

```shell
yarn dev
```

### On your local environment

Open your browser and go to [http://localhost:9876/](http://localhost:9876/).
