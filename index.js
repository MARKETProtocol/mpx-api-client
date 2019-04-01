"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.mpxAPI = exports.Path = exports.MPXAPIError = exports.Errors = void 0;

var _without = _interopRequireDefault(require("lodash/without"));

var _kebabCase = _interopRequireDefault(require("lodash/kebabCase"));

var _pick = _interopRequireDefault(require("lodash/pick"));

var _map = _interopRequireDefault(require("lodash/map"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Date.prototype.toString.call(Reflect.construct(Date, [], function () {})); return true; } catch (e) { return false; } }

function _construct(Parent, args, Class) { if (isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

var host;
var Errors = {
  HOST_NOT_SET_ERROR: new Error("host url not set. Invoke the 'setHost()' function with your mpxAPI host")
};
exports.Errors = Errors;

var MPXAPIError =
/*#__PURE__*/
function (_Error) {
  _inherits(MPXAPIError, _Error);

  function MPXAPIError(error) {
    var _this;

    _classCallCheck(this, MPXAPIError);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(MPXAPIError).call(this, error.detail || error.title)); // set error properties on the property error

    Object.assign(_assertThisInitialized(_this), (0, _pick.default)(error, ['id', 'status', 'code', 'title', 'detail']));
    return _this;
  }

  return MPXAPIError;
}(_wrapNativeSuper(Error));
/**
 * Appends correct host to path
 *
 * @param {string} path
 * @param {string} filterString
 * @param {string} id
 * @return {string}
 */


exports.MPXAPIError = MPXAPIError;

var url = function url(path, filterString, id) {
  if (typeof host !== 'string') {
    throw Errors.HOST_NOT_SET_ERROR;
  }

  var url = host + path + (id !== null ? "/".concat(id) : '') + (filterString !== null ? "".concat('?' + filterString) : '');
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


var serializeRequest = function serializeRequest(path, body) {
  var JSONAPISerializer = require('jsonapi-serializer').Serializer;

  var pathSegments = path.split('/').filter(Boolean);
  var type = body.type || (0, _kebabCase.default)(pathSegments[0]);

  if (!Array.isArray(body) && !body.id && pathSegments[1]) {
    body.id = pathSegments[1];
  }

  var serializedRequest = Object.assign(new JSONAPISerializer(type, {
    attributes: (0, _without.default)(Object.keys(body), 'id')
  }).serialize(body));
  return serializedRequest;
};

var jsonAPIRequestHandler = function jsonAPIRequestHandler(path, body, serialize) {
  return JSON.stringify(serialize ? serializeRequest(path, body) : body);
};
/**
 * Create Auth/UnAuthed Header
 *
 * @param {string} authorizationToken
 */


var createHeader = function createHeader(authorizationToken) {
  if (authorizationToken) {
    return {
      'Content-Type': 'application/vnd.api+json',
      Authorization: "Bearer ".concat(authorizationToken)
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


var jsonAPIResponseHandler = function jsonAPIResponseHandler(deserialize) {
  return function (response) {
    if (response.status === 204) {
      return response;
    }

    return response.json().then(function (json) {
      if (!response.ok) {
        return Promise.reject((0, _map.default)(json.errors, function (error) {
          return new MPXAPIError(error);
        }));
      }

      if (deserialize) {
        var JSONAPIDeserializer = require('jsonapi-serializer').Deserializer;

        var opts = {
          keyForAttribute: 'camelCase'
        };
        return new JSONAPIDeserializer(opts).deserialize(json, function (err, deserializedResponse) {
          return deserializedResponse;
        });
      } else {
        return json;
      }
    });
  };
}; // paths to API resources


var Path = {
  Contracts: '/contracts',
  FeeRecipients: '/fee_recipients',
  Fills: '/fills',
  JWT: '/json_web_tokens',
  Me: '/me',
  OrderBook: '/orderbooks',
  Orders: '/orders',
  Settings: '/settings',
  TokenPairs: '/token_pairs'
};
exports.Path = Path;
var mpxAPI = {
  /**
   * Set host for mpx-api
   * example https://api.mpxechange.io
   *
   * @param {string} newHost apiHost
   */
  setHost: function setHost(newHost) {
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
  get: function get(path) {
    var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref$fetch = _ref.fetch,
        fetch = _ref$fetch === void 0 ? window.fetch : _ref$fetch,
        _ref$filterString = _ref.filterString,
        filterString = _ref$filterString === void 0 ? null : _ref$filterString,
        _ref$id = _ref.id,
        id = _ref$id === void 0 ? null : _ref$id,
        _ref$deserialize = _ref.deserialize,
        deserialize = _ref$deserialize === void 0 ? true : _ref$deserialize,
        _ref$authorizationTok = _ref.authorizationToken,
        authorizationToken = _ref$authorizationTok === void 0 ? null : _ref$authorizationTok;

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
  post: function post(path) {
    var body = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var _ref2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
        _ref2$fetch = _ref2.fetch,
        fetch = _ref2$fetch === void 0 ? window.fetch : _ref2$fetch,
        _ref2$filterString = _ref2.filterString,
        filterString = _ref2$filterString === void 0 ? null : _ref2$filterString,
        _ref2$id = _ref2.id,
        id = _ref2$id === void 0 ? null : _ref2$id,
        _ref2$serializeReques = _ref2.serializeRequest,
        serializeRequest = _ref2$serializeReques === void 0 ? true : _ref2$serializeReques,
        _ref2$deserialize = _ref2.deserialize,
        deserialize = _ref2$deserialize === void 0 ? true : _ref2$deserialize,
        _ref2$authorizationTo = _ref2.authorizationToken,
        authorizationToken = _ref2$authorizationTo === void 0 ? null : _ref2$authorizationTo;

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
  patch: function patch(path) {
    var body = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var _ref3 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
        _ref3$fetch = _ref3.fetch,
        fetch = _ref3$fetch === void 0 ? window.fetch : _ref3$fetch,
        _ref3$filterString = _ref3.filterString,
        filterString = _ref3$filterString === void 0 ? null : _ref3$filterString,
        _ref3$id = _ref3.id,
        id = _ref3$id === void 0 ? null : _ref3$id,
        _ref3$serializeReques = _ref3.serializeRequest,
        serializeRequest = _ref3$serializeReques === void 0 ? true : _ref3$serializeReques,
        _ref3$deserialize = _ref3.deserialize,
        deserialize = _ref3$deserialize === void 0 ? true : _ref3$deserialize,
        _ref3$authorizationTo = _ref3.authorizationToken,
        authorizationToken = _ref3$authorizationTo === void 0 ? null : _ref3$authorizationTo;

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
  put: function put(path) {
    var body = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    var _ref4 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
        _ref4$fetch = _ref4.fetch,
        fetch = _ref4$fetch === void 0 ? window.fetch : _ref4$fetch,
        _ref4$filterString = _ref4.filterString,
        filterString = _ref4$filterString === void 0 ? null : _ref4$filterString,
        _ref4$id = _ref4.id,
        id = _ref4$id === void 0 ? null : _ref4$id,
        _ref4$serializeReques = _ref4.serializeRequest,
        serializeRequest = _ref4$serializeReques === void 0 ? true : _ref4$serializeReques,
        _ref4$deserialize = _ref4.deserialize,
        deserialize = _ref4$deserialize === void 0 ? true : _ref4$deserialize,
        _ref4$authorizationTo = _ref4.authorizationToken,
        authorizationToken = _ref4$authorizationTo === void 0 ? null : _ref4$authorizationTo;

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
  delete: function _delete(path) {
    var _ref5 = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
        _ref5$fetch = _ref5.fetch,
        fetch = _ref5$fetch === void 0 ? window.fetch : _ref5$fetch,
        _ref5$filterString = _ref5.filterString,
        filterString = _ref5$filterString === void 0 ? null : _ref5$filterString,
        _ref5$id = _ref5.id,
        id = _ref5$id === void 0 ? null : _ref5$id,
        _ref5$deserialize = _ref5.deserialize,
        deserialize = _ref5$deserialize === void 0 ? true : _ref5$deserialize,
        _ref5$authorizationTo = _ref5.authorizationToken,
        authorizationToken = _ref5$authorizationTo === void 0 ? null : _ref5$authorizationTo;

    return fetch(url(path, filterString, id), {
      method: 'DELETE',
      headers: createHeader(authorizationToken)
    }).then(jsonAPIResponseHandler(deserialize));
  },
  Path: Path
};
exports.mpxAPI = mpxAPI;
var _default = mpxAPI;
exports.default = _default;
