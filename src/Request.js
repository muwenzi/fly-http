import utils from './utils'

/**
 * Helper for building HTTP requests.
 * @constructor
 */
function Request () {
  this._path = []
  this._params = {}
  this._headers = {}
  this._formData = []
  this._formUrl = ''
}

let RequestCacheMap = {}

Request.clearCache = function () {
  RequestCacheMap = {}
}

Request.prototype = {
  _path: null,
  _params: null,
  _headers: null,
  _raw: false,
  _download: false,
  _cache: null,
  _external: null,
  _beforeSend: [],
  _processData: true,
  _formData: [],
  _formUrl: '',
  _options: {},
  /**
   * Add query parameter to request url.
   * @param key {String}
   * @param value {String|Number|Boolean|Array}
   * @return {Request}
   */
  query: function (key, value) {
    if (value !== null && value !== undefined) {
      this._params[key] = value
    }
    return this
  },

  queryAll: function (params) {
    Object.entries(params).forEach(([key, value]) => {
      this.query(key, value)
    })
    return this
  },
  /**
   * Append formData params.
   * @return {Request}
   */
  append: function () {
    if (arguments.length) {
      this._formData.push(arguments)
    }
    return this
  },
  /**
   * Convert the javascript object to a FormData and sets the request body.
   * @param {Object} formObject An object which will be converted to a FormData.
   * @return {Request}
   */
  formData: function (formObject) {
    if (!utils.isObject(formObject)) {
      console.warn('form Data must be Object.')
    }
    for (const [key, value] of Object.entries(formObject)) {
      if (value instanceof Array) {
        for (const item of value) { this.append(key + '[]', item) }
      } else {
        this.append(key, value)
      }
    }
    return this
  },
  /**
   * Convert the input to an url encoded string and sets the content-type header and body.
   * If the input argument is already a string, skips the conversion part.
   * @param {String|Object} input convert into an url encoded string or an already encoded string.
   * @return {Request}
   */
  formUrl: function (input) {
    if (!utils.isObject(input) && !utils.isString(input)) {
      console.warn('form Data must be Object or string.')
      return
    }
    this._formUrl = utils.isString(input) ? input : encodeObject(input)
    this.content('application/x-www-form-urlencoded')
    return this
  },
  /**
   * Callback that gets invoked with string url before sending.
   * Note: It can only change headers and body of the request.
   * @param callback Called with arguments (method, url, body) and "this" is this Request.
   * @returns {Request}.
   */
  beforeSend: function (callback) {
    this._beforeSend.push(callback)
    return this
  },
  /**
   * Add path segment to request url including non-encoded path segment.
   * @param {String|Int} path
   * @return {Request}
   */
  path: function (path) {
    if (utils.isNumeric(path) || utils.isBoolean(path)) {
      path = path.toString()
    }

    if (!path) {
      path = ''
    }

    this._path.push(path.includes('/') ? encodeURI(path) : encodeURIComponent(path))

    return this
  },
  /**
   * Add header to request.
   * @param {String} name
   * @param {String|Number|Boolean} value
   * @return {Request}
   */
  header: function (name, value) {
    this._headers[name] = value
    return this
  },
  /**
   * Convenience method for setting the "Authorization" header.
   * @param {String} value
   * @return {Request}
   */
  auth: function (value) {
    this._headers['Authorization'] = value
    return this
  },
  /**
   * Set the content type of the body.
   * @param {String} contentType
   * @returns {Request}
   */
  content: function (contentType) {
    this._headers['Content-Type'] = contentType
    return this
  },
  /**
   * Convenience method for sending data as plain text.
   * @returns {Request}
   */
  withText: function () {
    return this.content('text/plain')
  },
  /**
   * Convenience method for sending data as json.
   * @returns {Request}
   */
  withJson: function () {
    return this.content('application/json')
  },
  /**
   * Set the Accept header.
   * @param {String} acceptType
   * @returns {Request}
   */
  accept: function (acceptType) {
    this._headers['Accept'] = acceptType
    return this
  },
  /**
   * Convenience method for getting plain text response.
   * @returns {Request}
   */
  asText: function () {
    return this.accept('text/plain')
  },
  /**
   * Convenience method for getting XML response.
   * @returns {Request}
   */
  asXML: function () {
    return this.accept('text/xml')
  },
  /**
   * Return a promise for the response (including status code and headers), rather than for just the response data.
   * @returns {Request}
   */
  enrichResponse: function () {
    this._raw = true
    return this
  },
  /**
   * Makes this request cache for ttl milliseconds.
   * @param {Number} [ttl=forever]
   * @returns {Request}
   */
  cache: function (ttl) {
    this._cache = utils.isNumeric(ttl) ? ttl : -1
    return this
  },
  processData: function (processData) {
    this._processData = processData
    return this
  },
  /**
   * Alias for query().
   * @return {Request}
   */
  q: function () {
    return this.query.apply(this, arguments)
  },
  /**
   * Alias for path().
   * @return {Request}
   */
  p: function () {
    return this.path.apply(this, arguments)
  },
  /**
   * Send GET request.
   * @return {Promise}
   */
  get: function () {
    return this.send('GET', null)
  },
  /**
   * Send PATCH request.
   * @param {*} body
   * @return {Promise}
   */
  patch: function (body) {
    return this.send('PATCH', body)
  },
  /**
   * Send POST request.
   * @param {*} body
   * @return {Promise}
   */
  post: function (body) {
    return this.send('POST', body)
  },
  /**
   * Send PUT request.
   * @param {*} body
   * @return {Promise}
   */
  put: function (body) {
    return this.send('PUT', body)
  },
  /**
   * Send DELETE request.
   * @return {Promise}
   */
  delete: function () {
    return this.send('DELETE', null)
  },
  /**
   * Send HEAD request.
   * @return {Promise}
   */
  head: function () {
    return this.send('HEAD', null)
  },
  /**
   * Send request.
   *
   * @param {String} method HTTP method.
   * @param {*} body Request body.
   * @return {Promise} A promise for the response data. Rejects with the full response on errors.
   */
  send: function (method, body) {
    let url = buildUrl(this._path, this._params)

    if (!this._headers['Content-Type']) {
      body ? this.content('application/json') : this.content('text/plain')
    }

    if (!this._headers['Accept']) {
      this.accept('application/json')
    }

    if (body && this._headers['Content-Type'] === 'application/json') {
      body = JSON.stringify(body)
    }

    if (this._cache !== null && method.toUpperCase() !== 'GET') {
      throw new Error('Can only cache GET requests')
    }

    let cacheEnabled = this._cache !== null
    let cacheKey = url

    if (cacheEnabled) {
      if (RequestCacheMap[cacheKey]) {
        return RequestCacheMap[cacheKey]
      }
    }

    this._beforeSend.forEach(function (callback) {
      callback.call(this, method, url, body)
    }, this)

    let resolveWithRaw = this._raw

    let out = this._sendRequest(url, method, body || null, this._headers)
      .then(function (httpResponse) {
        let promiseResponse = resolveWithRaw ? httpResponse : httpResponse.data
        return promiseResponse
      })
      .catch(function (httpResponse) {
        return Promise.reject(httpResponse)
      })

    if (cacheEnabled) {
      RequestCacheMap[cacheKey] = out

      if (this._cache > -1) {
        setTimeout(function () {
          delete RequestCacheMap[cacheKey]
        }, this._cache)
      }
    }

    return out
  },

  /**
   * Actually send the request, using different libraries depending on environment.
   * Returns the response in a normalized format as an object with data, status and headers properties.
   *
   * For tests, mock this method to avoid sending any real requests.
   * @param {String} url Request url (before environment normalization, i.e. without /proxy for client-side).
   * @param {String} method Request method.
   * @param {*} body Request body.
   * @param {Object} headers Map of header names to values.
   * @returns {Promise} A promise for the normalized response. Rejects with the same if the request failed.
   * @private
   */
  _sendRequest: function (url, method, body, headers) {},

  _resolveUrl: function (url) {}
}

function encodeQueryValue (key, value) {
  return encodeURIComponent(key) +
    '=' +
    encodeURIComponent(
      typeof value === 'object'
        ? JSON.stringify(value)
        : '' + value
    )
}

function encodeObject (obj) {
  return Object.keys(obj).map(function (key) {
    let value = obj[key]
    if (!utils.isArray(value)) {
      value = [value]
    }
    // Query param values that are lists (e.g. tag: [1, 2, 3]) should be sent as tag=1&tag=2&tag=3 to match the API.
    return value.map(valItem => encodeQueryValue(key, valItem)).join('&')
  }).join('&')
}

function buildUrl (path, params) {
  let url = path.join('/')
  if (!utils.isEmpty(params)) {
    url += '?' + encodeObject(params)
  }
  return url
}

export default Request
