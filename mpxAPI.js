import without from 'lodash/without';
import kebabCase from 'lodash/kebabCase';
import pick from 'lodash/pick';
import map from 'lodash/map';

let host;

export const Errors = {
  HOST_NOT_SET_ERROR: new Error(`host url not set. Invoke the 'setHost()' function with your mpxAPI host`)
}

export class MPXAPIError extends Error {
  constructor(error) {
    super(error.detail || error.title);

    // set error properties on the property error
    Object.assign(
      this,
      pick(error, ['id', 'status', 'code', 'title', 'detail'])
    );
  }
}

/**
 * Appends correct host to path
 *
 * @param {string} path
 * @param {string} filterString
 * @param {string} id
 * @return {string}
 */
const url = (path, filterString, id) => {
  if (typeof host !== 'string') {
    throw Errors.HOST_NOT_SET_ERROR;
  }
  const url =
    host +
    path +
    (id !== null ? `/${id}` : '') +
    (filterString !== null ? `${'?' + filterString}` : '');

  return url;
};

/**
 * Serializes body object to conform with a jsonapi format.
 * If no type is specified on the body object, it attempts
 * to extract the type from the first path segment.
 *
 * If no id is specified for the object, it attempts to extract
 * the id from the second path segment. Although, if body is an
 * array, it doesn't extract id from path segment
 *
 *
 * @param {string} path
 * @param {object | object[]} body
 */
const serializeRequest = (path, body) => {
  const JSONAPISerializer = require('jsonapi-serializer').Serializer;
  const pathSegments = path.split('/').filter(Boolean);
  const type = body.type || kebabCase(pathSegments[0]);

  if (!Array.isArray(body) && !body.id && pathSegments[1]) {
    body.id = pathSegments[1];
  }

  const serializedRequest = Object.assign(
    new JSONAPISerializer(type, {
      attributes: without(Object.keys(body), 'id')
    }).serialize(body)
  );

  return serializedRequest;
};

const jsonAPIRequestHandler = (path, body, serialize) =>
  JSON.stringify(serialize ? serializeRequest(path, body) : body);

/**
 * Create Auth/UnAuthed Header
 *
 * @param {string} authorizationToken
 */
const createHeader = authorizationToken => {
  if (authorizationToken) {
    return {
      'Content-Type': 'application/vnd.api+json',
      Authorization: `Bearer ${authorizationToken}`
    };
  } else {
    return {
      'Content-Type': 'application/vnd.api+json'
    };
  }
};

/**
 * Create a response handle for api requests.
 * Takes an argument to deserialize response according to jsonapi
 *
 * @param {bool} deserialize
 * @return {(object): object}
 */
const jsonAPIResponseHandler = deserialize => response => {
  if (response.status === 204) {
    return response;
  }

  return response.json().then(json => {
    if (!response.ok) {
      return Promise.reject(map(
        json.errors,
        error => new MPXAPIError(error))
      );
    }

    if (deserialize) {
      const JSONAPIDeserializer = require('jsonapi-serializer').Deserializer;
      const opts = {
        keyForAttribute: 'camelCase'
      };

      return new JSONAPIDeserializer(opts).deserialize(
        json,
        (err, deserializedResponse) => {
          return deserializedResponse;
        }
      );
    } else {
      return json;
    }
  });
};

// paths to API resources
export const Path = {
  Contracts: '/contracts',
  FeeRecipients: '/fee_recipients',
  Fills: '/fills',
  JWT: '/json_web_tokens',
  Me: '/me',
  OrderBook: '/orderbooks',
  Orders: '/orders',
  Settings: '/settings'
  TokenPairs: '/token_pairs',
};

export const mpxAPI = {
  /**
   * Set host for mpx-api
   * example https://api.mpxechange.io
   *
   * @param {string} newHost apiHost
   */
  setHost(newHost) {
    host = newHost;
  },

  /**
   * Makes a GET request to the mpxAPI resource at `path`.
   *
   * @param {string} path Path to request API
   * @param {function} fetch API fetch function defaults to fetch()
   * @param {bool} toJson Flag to convert result to
   * @return {Promise<*>} result of request
   */
  get(
    path,
    {
      fetch = window.fetch,
      filterString = null,
      id = null,
      deserialize = true,
      authorizationToken = null
    } = {}
  ) {
    return fetch(url(path, filterString, id), {
      method: 'GET',
      headers: createHeader(authorizationToken)
    }).then(jsonAPIResponseHandler(deserialize));
  },

  /**
   * Makes a POST request to the marketAPI resource at `path`.
   *
   * @param {string} path Path to request API
   * @param {function} fetch API fetch function defaults to fetch()
   * @param {body} body Payload Object
   * @param {bool} deserialize Flag to convert result to
   * @return {Promise<*>} result of request
   */
  post(
    path,
    body = {},
    {
      fetch = window.fetch,
      filterString = null,
      id = null,
      serializeRequest = true,
      deserialize = true,
      authorizationToken = null
    } = {}
  ) {
    return fetch(url(path, filterString, id), {
      method: 'POST',
      headers: createHeader(authorizationToken),
      body: jsonAPIRequestHandler(path, body, serializeRequest)
    }).then(jsonAPIResponseHandler(deserialize));
  },

  /**
   * Makes a PATCH request to the marketAPI resource at `path`.
   *
   * @param {string} path Path to request API
   * @param {function} fetch API fetch function defaults to fetch()
   * @param {body} body OpenOrder Object
   * @param {bool} deserialize Flag to convert result to
   * @return {Promise<*>} result of request
   */
  patch(
    path,
    body = {},
    {
      fetch = window.fetch,
      filterString = null,
      id = null,
      serializeRequest = true,
      deserialize = true,
      authorizationToken = null
    } = {}
  ) {
    return fetch(url(path, filterString, id), {
      method: 'PATCH',
      headers: createHeader(authorizationToken),
      body: jsonAPIRequestHandler(path, body, serializeRequest)
    }).then(jsonAPIResponseHandler(deserialize));
  },

  /**
   * Makes a PUT request to the marketAPI resource at `path`.
   *
   * @param {string} path Path to request API
   * @param {function} fetch API fetch function defaults to fetch()
   * @param {body} body OpenOrder Object
   * @param {bool} deserialize Flag to convert result to
   * @return {Promise<*>} result of request
   */
  put(
    path,
    body = {},
    {
      fetch = window.fetch,
      filterString = null,
      id = null,
      serializeRequest = true,
      deserialize = true,
      authorizationToken = null
    } = {}
  ) {
    return fetch(url(path, filterString, id), {
      method: 'PUT',
      headers: createHeader(authorizationToken),
      body: jsonAPIRequestHandler(path, body, serializeRequest)
    }).then(jsonAPIResponseHandler(deserialize));
  },

  /**
   * Makes a DELETE request to the marketAPI resource at `path`.
   *
   * @param {string} path Path to request API
   * @param {function} fetch API fetch function defaults to fetch()
   * @param {bool} deserialize Flag to convert result to
   * @return {Promise<*>} result of request
   */
  delete(
    path,
    {
      fetch = window.fetch,
      filterString = null,
      id = null,
      deserialize = true,
      authorizationToken = null
    } = {}
  ) {
    return fetch(url(path, filterString, id), {
      method: 'DELETE',
      headers: createHeader(authorizationToken)
    }).then(jsonAPIResponseHandler(deserialize));
  },

  Path,
};

export default mpxAPI;