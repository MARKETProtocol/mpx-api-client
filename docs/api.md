## Classes

<dl>
<dt><a href="#MPXAPIError">MPXAPIError</a></dt>
<dd><p>MPXAPIError represents an Error that is gotten from the api response.
It is usually returned as an Array of MPXAPIError.</p>
</dd>
</dl>

## Objects

<dl>
<dt><a href="#Path">Path</a> : <code>object</code></dt>
<dd><p>Path constants that should be used when calling any of the <code>get</code>, <code>post</code>, etc.
functions on the mpxAPI client</p>
</dd>
<dt><a href="#mpxAPI">mpxAPI</a> : <code>object</code></dt>
<dd><p>mpxAPI client namespace object.</p>
<p>Use the methods on this to to make requests</p>
</dd>
</dl>

## Typedefs

<dl>
<dt><a href="#ResponseHandler">ResponseHandler</a> : <code>function</code></dt>
<dd><p>Callback for handling a response.
Error would usually be an array of MPXAPIErrors.</p>
</dd>
<dt><a href="#RequestOptions">RequestOptions</a> : <code>Object</code></dt>
<dd><p>Extra Options objects that are passed to request methods on the</p>
</dd>
</dl>

<a name="MPXAPIError"></a>

## MPXAPIError
MPXAPIError represents an Error that is gotten from the api response.
It is usually returned as an Array of MPXAPIError.

**Kind**: global class  
<a name="new_MPXAPIError_new"></a>

### new exports.MPXAPIError(error)

| Param | Type |
| --- | --- |
| error | <code>Error</code> | 

<a name="Path"></a>

## Path : <code>object</code>
Path constants that should be used when calling any of the `get`, `post`, etc.
functions on the mpxAPI client

**Kind**: global namespace  

* [Path](#Path) : <code>object</code>
    * [.Root](#Path.Root)
    * [.Contracts](#Path.Contracts)
    * [.FeeRecipients](#Path.FeeRecipients)
    * [.Fills](#Path.Fills)
    * [.JWT](#Path.JWT)
    * [.Me](#Path.Me)
    * [.OrderBook](#Path.OrderBook)
    * [.Orders](#Path.Orders)
    * [.Settings](#Path.Settings)
    * [.TokenPairs](#Path.TokenPairs)

<a name="Path.Root"></a>

### Path.Root
Path to list a summary of all resources and their actions.

**Kind**: static property of [<code>Path</code>](#Path)  
<a name="Path.Contracts"></a>

### Path.Contracts
Path to contract resources.

**Kind**: static property of [<code>Path</code>](#Path)  
<a name="Path.FeeRecipients"></a>

### Path.FeeRecipients
Path to fee receipeint resources.

**Kind**: static property of [<code>Path</code>](#Path)  
<a name="Path.Fills"></a>

### Path.Fills
Path to fills resources.

**Kind**: static property of [<code>Path</code>](#Path)  
<a name="Path.JWT"></a>

### Path.JWT
Path to perform jwt authentication.

**Kind**: static property of [<code>Path</code>](#Path)  
<a name="Path.Me"></a>

### Path.Me
Path to profile of current authenticated user.

**Kind**: static property of [<code>Path</code>](#Path)  
<a name="Path.OrderBook"></a>

### Path.OrderBook
Path to orderbook resources.

**Kind**: static property of [<code>Path</code>](#Path)  
<a name="Path.Orders"></a>

### Path.Orders
Path to order resources on the API.

**Kind**: static property of [<code>Path</code>](#Path)  
<a name="Path.Settings"></a>

### Path.Settings
Path to API settings

**Kind**: static property of [<code>Path</code>](#Path)  
<a name="Path.TokenPairs"></a>

### Path.TokenPairs
Path to fetch token pairs on the API.

**Kind**: static property of [<code>Path</code>](#Path)  
<a name="mpxAPI"></a>

## mpxAPI : <code>object</code>
mpxAPI client namespace object.

Use the methods on this to to make requests

**Kind**: global namespace  
**Example**  
```
import { mpxAPI, Path } from '@marketprotocol/mpx-api-client'

mpxAPI.setHost('https://host-for-mpx-client');

// fetch all token pairs
mpxAPI.get(Path.TokenPairs)
 .then(tokenPairs, () => {
   // do what you want tokenPairs
 });
```

* [mpxAPI](#mpxAPI) : <code>object</code>
    * [.Path](#mpxAPI.Path)
    * [.setHost(newHost)](#mpxAPI.setHost)
    * [.setGlobalResponseHandler(handler)](#mpxAPI.setGlobalResponseHandler)
    * [.get(path, options)](#mpxAPI.get) ⇒ <code>Promise.&lt;\*&gt;</code>
    * [.post(path, body, options)](#mpxAPI.post) ⇒ <code>Promise.&lt;\*&gt;</code>
    * [.patch(path, body, options)](#mpxAPI.patch) ⇒ <code>Promise.&lt;\*&gt;</code>
    * [.put(path, body, options)](#mpxAPI.put) ⇒ <code>Promise.&lt;\*&gt;</code>
    * [.delete(path, options)](#mpxAPI.delete) ⇒ <code>Promise.&lt;\*&gt;</code>

<a name="mpxAPI.Path"></a>

### mpxAPI.Path
Alias for the global named export `Path`.
Added for convenience

**Kind**: static property of [<code>mpxAPI</code>](#mpxAPI)  
<a name="mpxAPI.setHost"></a>

### mpxAPI.setHost(newHost)
Set host for mpx-api
example https://api.mpxechange.io

**Kind**: static method of [<code>mpxAPI</code>](#mpxAPI)  

| Param | Type | Description |
| --- | --- | --- |
| newHost | <code>string</code> | apiHost |

<a name="mpxAPI.setGlobalResponseHandler"></a>

### mpxAPI.setGlobalResponseHandler(handler)
Register a global response handler. 
All response from all requests would be send to this handler is set.

To unregister pass in a null handler argument.

**Kind**: static method of [<code>mpxAPI</code>](#mpxAPI)  

| Param | Type |
| --- | --- |
| handler | [<code>ResponseHandler</code>](#ResponseHandler) | 

<a name="mpxAPI.get"></a>

### mpxAPI.get(path, options) ⇒ <code>Promise.&lt;\*&gt;</code>
Makes a GET request to the mpxAPI resource at `path`.

**Kind**: static method of [<code>mpxAPI</code>](#mpxAPI)  
**Returns**: <code>Promise.&lt;\*&gt;</code> - - Result of request  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | Path to request API |
| options | [<code>RequestOptions</code>](#RequestOptions) | Extra request options |

<a name="mpxAPI.post"></a>

### mpxAPI.post(path, body, options) ⇒ <code>Promise.&lt;\*&gt;</code>
Makes a POST request to the mpxAPI resource at `path`.

**Kind**: static method of [<code>mpxAPI</code>](#mpxAPI)  
**Returns**: <code>Promise.&lt;\*&gt;</code> - result of request  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | Path to request API |
| body | <code>Object</code> | Request body payload |
| options | [<code>RequestOptions</code>](#RequestOptions) | Extra request options |

<a name="mpxAPI.patch"></a>

### mpxAPI.patch(path, body, options) ⇒ <code>Promise.&lt;\*&gt;</code>
Makes a PATCH request to the marketAPI resource at `path`.

**Kind**: static method of [<code>mpxAPI</code>](#mpxAPI)  
**Returns**: <code>Promise.&lt;\*&gt;</code> - result of request  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | Path to request API |
| body | <code>Object</code> | Request body payload |
| options | [<code>RequestOptions</code>](#RequestOptions) | Extra request options |

<a name="mpxAPI.put"></a>

### mpxAPI.put(path, body, options) ⇒ <code>Promise.&lt;\*&gt;</code>
Makes a PUT request to the marketAPI resource at `path`.

**Kind**: static method of [<code>mpxAPI</code>](#mpxAPI)  
**Returns**: <code>Promise.&lt;\*&gt;</code> - result of request  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | Path to request API |
| body | <code>Object</code> | Request body payload |
| options | [<code>RequestOptions</code>](#RequestOptions) | Extra request options |

<a name="mpxAPI.delete"></a>

### mpxAPI.delete(path, options) ⇒ <code>Promise.&lt;\*&gt;</code>
Makes a DELETE request to the marketAPI resource at `path`.

**Kind**: static method of [<code>mpxAPI</code>](#mpxAPI)  
**Returns**: <code>Promise.&lt;\*&gt;</code> - result of request  

| Param | Type | Description |
| --- | --- | --- |
| path | <code>string</code> | Path to request API |
| options | [<code>RequestOptions</code>](#RequestOptions) | Extra request options |

<a name="ResponseHandler"></a>

## ResponseHandler : <code>function</code>
Callback for handling a response.
Error would usually be an array of MPXAPIErrors.

**Kind**: global typedef  

| Param | Type | Description |
| --- | --- | --- |
| err | <code>Error</code> | Error if any, null if no error |
| data | <code>object</code> | Parse json-api response data. |

<a name="RequestOptions"></a>

## RequestOptions : <code>Object</code>
Extra Options objects that are passed to request methods on the

**Kind**: global typedef  
**Properties**

| Name | Type | Description |
| --- | --- | --- |
| id | <code>string</code> | String value that overrides the id on the resource being requested. defaults to `null`. |
| filterString | <code>string</code> | Filter string, primarily used in get requests. defaults to `null`. |
| serializeRequest | <code>boolean</code> | Flag to state if the payload has should be json-api serialized. defaults to `true`. |
| deserialize | <code>boolean</code> | Flag to state if the response from a request should be json-api deserialized or note. defaults to `false`. |
| authorizationToken | <code>string</code> | Authorization token. Required for request to authenticated paths. |

