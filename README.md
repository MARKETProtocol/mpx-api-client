# MPX API Client
[![Build Status](https://travis-ci.com/MARKETProtocol/mpx-api-client.svg?branch=master)](https://travis-ci.com/MARKETProtocol/mpx-api-client)

This is the javascript client for interacting with MPX-API

## Table of Content
- [Installation](#installation)
- [Getting Started](#getting-started)
- [Documentation](#documentation)
- [Contributing](#contributing)
- [License](#license)

## Installation

To install run

```
npm install @marketprotocol/mpx-api-client
```

## Getting Started

First, you would need to set the host for the mpxAPI client.

```javascript
import { mpxAPI, Path } from '@marketprotocol/mpx-api-client'
 
mpxAPI.setHost('https://host-for-mpx-client');
```
This ensures that the client always makes a request to the set api environment (kovan/mainnet).

The `mpxAPI` namespace object provides HTTP methods (`get`, `post`, `patch` etc) to make requests to the corresponding resource on MPX API. Each of these methods return a promise that resolves 
to the response of the data of the api request else if rejects with an Array of `MPXAPIError`.

For example, to get the list of `tokenPair` listed on the exchange, you do:
```javascript
 // fetch all token pairs
mpxAPI.get(Path.TokenPairs)
  .then(tokenPairs, () => {
    // do what you want tokenPairs
  });
```

To get a list of all available resources and possible actions you can check the API documentation here or make a request via `mpxAPI.get(Path.Root)` and inspect its response.

## Documentation

See the full API documentation for the client at [docs/api.md](./docs/api.md).


## Contributing

- Clone the repository.
- Ensure everythign is working by running the test with `npm run test`.
- After making your changes. Open a PR.

## License

This project is under the Apache 2.0 license.
