# Shine Public API

[![Code Owners](https://img.shields.io/badge/owner-platform-blueviolet?style=flat&logo=github)](./.github/CODEOWNERS)

This projects aims at demonstrating how to use Shine Public API.

See the full Shine Connect documentation [here](https://developers.shine.fr/v3.1/reference).

## Install

```
yarn install
```

## Configuration

Copy `server/config/config.example.js` to a new `server/config/config.js` and fill the following values

| Variable       | Description                                                                                          |
| -------------- | ---------------------------------------------------------------------------------------------------- |
| CLIENT_ID      | Client ID given at the creation                                                                      |
| CLIENT_SECRET  | Secret given at the creation                                                                         |
| SCOPE          | Scope to be granted, will be presented to the user                                                   |
| REDIRECT_URI   | Redirect URI once authorization is granted. Make sure it is whitelisted in the client `redirectURIs` |
| WEBHOOK_SECRET | Secret provided by shine to check webhook signature                                                  |

## Run

```
yarn dev
```
