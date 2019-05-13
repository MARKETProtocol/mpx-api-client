import without from 'lodash/without';
import kebabCase from 'lodash/kebabCase';
import pick from 'lodash/pick';
import map from 'lodash/map';

/////// Type Definitions
/**
 * Callback for handling a response.
 * Error would usually be an array of MPXAPIErrors.
 *
 * @callback ResponseHandler
 * @param {Error} err - Error if any, null if no error
 * @param {object} data - Parse json-api response data.
 */

/**
 * Extra Options objects that are passed to request methods on the
 *
 *
 * @typedef {Object} RequestOptions
 * @property {string} id String value that overrides the id on the resource being requested. defaults to `null`.
 * @property {string} filterString Filter string, primarily used in get requests. defaults to `null`.
 * @property {boolean} serializeRequest Flag to state if the payload has should be json-api serialized. defaults to `true`.
 * @property {boolean} deserialize Flag to state if the response from a request should be json-api deserialized or note. defaults to `false`.
 * @property {string} authorizationToken Authorization token. Required for request to authenticated paths.
 */

////// end Type Definitions

let host;

/**
 * Cache to track register global response handler
 *
 * @private
 */
let globalResponseHandler = {
  handler: null,
  invoke: function(err, data) {
    if (this.handler) {
      try {
        const response = this.handler(err, data);
        if (response.catch) {
          response.catch(err => {
            // prevent promise handlers from erroring
          })
        }
      } catch (err) {
        // catch any error in handler
      }
    }
  }
};

export const Errors = {
  HOST_NOT_SET_ERROR: new Error(`host url not set. Invoke the 'setHost()' function with your mpxAPI host`)
}

/**
 * MPXAPIError represents an Error that is gotten from the api response.
 * It is usually returned as an Array of MPXAPIError.
 *
 */
export class MPXAPIError extends Error {
  /**
   *
   * @constructor
   * @param {Error} error
   */
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
 * @private
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
 * @private
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

/**
 *
 * @private
 * @param {string} path
 * @param {object | object[]} body
 * @param {boolean} serialize
 */
const jsonAPIRequestHandler = (path, body, serialize) =>
  JSON.stringify(serialize ? serializeRequest(path, body) : body);

/**
 * Create Auth/UnAuthed Header
 *
 * @private
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
 * @private
 * @param {bool} deserialize
 */
const jsonAPIResponseHandler = deserialize => response => {
  if (response.status === 204) {
    globalResponseHandler.invoke(null, response);
    return response;
  }

  return response.json().then(json => {
    if (!response.ok) {
      const error = map(
        json.errors,
        error => new MPXAPIError(error)
      );
      globalResponseHandler.invoke(error);
      return Promise.reject(error);
    }

    if (deserialize) {
      const JSONAPIDeserializer = require('jsonapi-serializer').Deserializer;
      const opts = {
        keyForAttribute: 'camelCase'
      };

      return new JSONAPIDeserializer(opts).deserialize(json)
        .then(deserializedData => {
          globalResponseHandler.invoke(null, deserializedData);
          return deserializedData;
        });
    } else {
      return json;
    }
  });
};

/**
 * Path constants that should be used when calling any of the `get`, `post`, etc.
 * functions on the mpxAPI client
 *
 * @namespace
 */
export const Path = {
  /**
   * Path to list a summary of all resources and their actions.
   *
   */
  Root: '/',
  /**
   * Path to contract resources.
   *
   */
  Contracts: '/contracts',
  /**
   * Path to fee receipeint resources.
   *
   */
  FeeRecipients: '/fee_recipients',
  /**
   * Path to fills resources.
   *
   */
  Fills: '/fills',
  /**
   * Path to perform jwt authentication.
   *
   */
  JWT: '/json_web_tokens',
  /**
   * Path to profile of current authenticated user.
   *
   */
  Me: '/me',
  /**
   * Path to user notifications
   *
   */
  Notifications: '/notifications',
  /**
   * Path to orderbook resources.
   *
   */
  OrderBook: '/orderbooks',
  /**
   * Path to order resources on the API.
   *
   */
  Orders: '/orders',
  /**
   * Path to asset rates in the MPX Ecosystem.
   *
   */
  Rates: '/rates',
  /**
   * Path to API settings
   *
   */
  Settings: '/settings',
  /**
   * Path to fetch token pairs on the API.
   *
   */
  TokenPairs: '/token_pairs',
  /**
   * Path to fetch User Settings on the API.
   *
   */
  UserSettings: '/user_settings'
};

/**
 * mpxAPI client namespace object.
 *
 * Use the methods on this to to make requests
 *
 * @example
 * ```
 * import { mpxAPI, Path } from '@marketprotocol/mpx-api-client'
 *
 * mpxAPI.setHost('https://api.mpexchange.io');
 *
 * // fetch all token pairs
 * mpxAPI.get(Path.TokenPairs)
 *  .then(tokenPairs, () => {
 *    // do what you want tokenPairs
 *  });
 * ```
 * @namespace
 */
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
   * Register a global response handler.
   * All response from all requests would be send to this handler is set.
   *
   * To unregister pass in a null handler argument.
   *
   *
   * @param {ResponseHandler} handler
   */
  setGlobalResponseHandler(handler) {
    if (handler !== null && typeof handler !== 'function') {
      throw new Error('global response handler must either be null or a function.');
    }

    globalResponseHandler.handler = handler;
  },

  /**
   * Makes a GET request to the mpxAPI resource at `path`.
   *
   * @param {string} path - Path to request API
   * @param {RequestOptions} options Extra request options
   * @return {Promise<*>} - Result of request
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
   * Makes a POST request to the mpxAPI resource at `path`.
   *
   * @param {string} path Path to request API
   * @param {Object} body Request body payload
   * @param {RequestOptions} options Extra request options
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
   * @param {Object} body Request body payload
   * @param {RequestOptions} options Extra request options
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
   * @param {Object} body Request body payload
   * @param {RequestOptions} options Extra request options
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
   * @param {RequestOptions} options Extra request options
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

  /**
   * Alias for the global named export `Path`.
   * Added for convenience
   */
  Path,
};
