require('babel-polyfill');

import { Path, mpxAPI, Errors, MPXAPIError } from '../mpxAPI';

const fetchMock = require('fetch-mock');

/**
 * 
 * @param {*} hostUrl 
 * @return {mpxAPI}
 */
const getClient = (hostUrl = 'https://stub-url.com') => {
  mpxAPI.setHost(hostUrl);
  return mpxAPI;
}

describe('mpxAPI', () => {
  afterEach(() => {
    fetchMock.reset();
  });

  it('should throw if host url is not set.', () => {
    expect(() => {
      getClient(null).get(Path.Fills);
    }).toThrow(Errors.HOST_NOT_SET_ERROR);
  });

  describe('get', () => {
    it('should reject with MPXAPIError if status code is not 200', () => {
      const path = Path.Fills;
      fetchMock.get(new RegExp(path), {
        status: 400,
        body: {
          errors: [
            {
              id: '9232382c-f059-4452-bf85-7939995bb167',
              status: 'Internal Server Error',
              code: '500',
              title: 'The server encountered an unexpected condition that prevented it from fulfilling the request.',
              detail: 'Error: INSUFFICIENT_MAKER_BALANCE'
            }
          ],
          jsonapi : { version: '1.0' }}
      })

      return getClient().get(path)
        .catch(err => {
          expect(Array.isArray(err)).toBe(true);
          expect(err[0]).toBeInstanceOf(MPXAPIError);
        });
    });
  });

  describe('post', () => {
    it('should reject with ServerError if status code is not 200', () => {
      const path = Path.Fills;
      fetchMock.post(new RegExp(path), {
        status: 400,
        body: {
          errors: [
            {
              id: '9232382c-f059-4452-bf85-7939995bb167',
              status: 'Internal Server Error',
              code: '500',
              title: 'The server encountered an unexpected condition that prevented it from fulfilling the request.',
              detail: 'Error: INSUFFICIENT_MAKER_BALANCE'
            }
          ],
          jsonapi : { version: '1.0' }}
      })

      return getClient().post(path, {})
        .catch(err => {
          expect(Array.isArray(err)).toBe(true);
          expect(err[0]).toBeInstanceOf(MPXAPIError);
        });
    });
  });

  describe('setGlobalResponseHandler', () => {
    it('should invoke global handler with parsed response',  () => {
      const path = Path.TokenPairs;
      fetchMock.post(new RegExp(path), {
        status: 200,
        body: {
          data: [
            {
              attributes: {
                "base-token-address": "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
                "base-token-asset-data": "0xf47261b0000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
                "base-token-decimals": "18",
                "base-token-symbol": "WETH",
                "is-enabled": true,
                "is-market-position-token": false,
                "pair-name": "WETH-DAI"
              },
              id: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc20x89d24a6b4ccb1b6faa2625fe562bdd9a23260359",
              type: "token-pairs"
            }
          ],
          jsonapi : { version: '1.0' }}
      });
      const expectedData = [{
        baseTokenAddress: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        baseTokenAssetData: "0xf47261b0000000000000000000000000c02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
        baseTokenDecimals: "18", 
        baseTokenSymbol: "WETH",
        id: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc20x89d24a6b4ccb1b6faa2625fe562bdd9a23260359",
        isEnabled: true,
        isMarketPositionToken: false,
        pairName: "WETH-DAI"
      }];
      const client = getClient();
      const globalHandler = jest.fn();

      client.setGlobalResponseHandler(globalHandler);

      return client.post(path, {})
        .then(data => {
          expect(globalHandler).toHaveBeenCalledWith(null, expectedData);
          expect(data).toEqual(expectedData);
        });
    });

    it('should invoke global handler with error', () => {
      const path = Path.Fills;
      fetchMock.post(new RegExp(path), {
        status: 400,
        body: {
          errors: [
            {
              id: '9232382c-f059-4452-bf85-7939995bb167',
              status: 'Internal Server Error',
              code: '500',
              title: 'The server encountered an unexpected condition that prevented it from fulfilling the request.',
              detail: 'Error: INSUFFICIENT_MAKER_BALANCE'
            }
          ],
          jsonapi : { version: '1.0' }}
      })
      const client = getClient();
      const globalHandler = jest.fn();

      client.setGlobalResponseHandler(globalHandler);

      return client.post(path, {})
        .catch(err => {
          expect(globalHandler).toHaveBeenCalled();
        });
    })
  });
});
