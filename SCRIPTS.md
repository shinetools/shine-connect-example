# Scripts

A set of script used to check http signature localy with your own qseal private and public key

# Validate signature locally

- Obtain your request for retrieving a profile using your own keys

- Update [file](scripts/__test__/example-payload.ts) and keep same format

  - Example of signature header format:
    ```js
    {
      signature: 'keyId="PSDFR-ACPR-71758",algorithm="rsa-sha256",headers="(request-target) date psu-ip-address psu-ip-port psu-http-method psu-date psu-user-agent psu-referer psu-accept psu-accept-charset psu-accept-encoding psu-accept-language",signature="Z+zWXASDGNZ6bxdJ7vbH+sa9fewp4LVQ0VWcufhyo84tLau+9sklQYviAYp3s6ZeK0o/LwYBrlFIe4A7Auz3lJ42c7TqcP+tZpJqniVhKL0V9LjAdm/VpKgINF7qzStcvAE7P0Vph2hO9YnXTsTjKUtHu2mBUpCNVKXgNVRw4CMsLOnObijTFfKGb6RLsMb6g6ORVyOwZmsSsTgw+pboPI2+j8XCdVvmP1/It+dEvnog7Po4Am/Akqryo0Gc0gikveyRsyGiwK0nmkOiO7doDhVQ9MaQqIfCqvosXEQRstune+N4WbLzO3H1g9XIricdgDhgSeB93eKXhJ5+ZkdziQ=="';
    }
    ```

- Run validation

```sh
$ yarn validate-signature ./server/certificates/qseal.pem scripts/__tests__/example-payload.json
```

- Error FAQ:

  - `ExpiredRequestError: clock skew of 17722517.181s was greater than 300s`: request expired
