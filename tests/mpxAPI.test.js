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
});
