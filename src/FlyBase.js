import util from './utils'

/**
 * Helper for building HTTP requests.
 * @constructor
 */
function FlyBase () {
  this._path = []
  this._params = {}
  this._headers = {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
  this._formData = []
}

let RequestCacheMap = {}

FlyBase.clearCache = function () {
  RequestCacheMap = {}
}

FlyBase.prototype = {
  _path: null,
  _params: null,
  _headers: null,
  _raw: false,
  _download: false,
  _cache: null,
  _external: null,
  _beforeSend: [],
  _processData: true,
  _formData: null,
  /**
   * Add query parameter to request url.
   * @param key {String}
   * @param value {String|Number|Boolean|Array}
   * @return {FlyBase}
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
   * Append formData params. Cancel body params for browser calls.
   * @return {FlyBase}
   */
  append: function () {
    if (arguments.length) {
      this._formData.push(arguments)
    }
    return this
  },
  /**
   * Callback that gets invoked with string url before sending.
   * Note: It can only change headers and body of the request.
   * @param callback Called with arguments (method, url, body) and "this" is this FlyBase
   * @returns {FlyBase}
   */
  beforeSend: function (callback) {
    this._beforeSend.push(callback)
    return this
  },
  /**
   * Add path segment to request url. Do not include the slash.
   * @param {String|Int} path
   * @return {FlyBase}
   */
  path: function (path) {
    if (util.isNumeric(path) || util.isBoolean(path)) {
      path = path.toString()
    }

    if (!path) {
      path = ''
    }

    this._path.push(path.indexOf('/') === -1 ? encodeURIComponent(path) : encodeURI(path))

    return this
  },
  /**
   * Add non-encoded path segment to request url.
   * @param {String|Int} path
   * @return {FlyBase}
   */
  pathRaw: function (path) {
    if (path) {
      this._path.push(path)
    }
    return this
  },
  /**
   * Add header to request.
   * @param {String} name
   * @param {String|Number|Boolean} value
   * @return {FlyBase}
   */
  header: function (name, value) {
    this._headers[name] = value
    return this
  },
  /**
   * Convenience method for setting the "Authorization" header.
   * @param {String} value
   * @return {FlyBase}
   */
  auth: function (value) {
    this._headers['Authorization'] = value
    return this
  },
  /**
   * Set the content type of the body.
   * @param {String} contentType
   * @returns {FlyBase}
   */
  content: function (contentType) {
    this._headers['Content-Type'] = contentType
    return this
  },
  /**
   * Convenience method for sending data as plain text.
   * @returns {FlyBase}
   */
  withText: function () {
    return this.content('text/plain')
  },
  /**
   * Convenience method for sending data as json.
   * @returns {FlyBase}
   */
  withJson: function () {
    return this.content('application/json')
  },
  /**
   * Set the Accept header.
   * @param {String} acceptType
   * @returns {FlyBase}
   */
  accept: function (acceptType) {
    this._headers['Accept'] = acceptType
    return this
  },
  /**
   * Convenience method for getting plain text response.
   * @returns {FlyBase}
   */
  asText: function () {
    return this.accept('text/plain')
  },
  /**
   * Convenience method for getting XML response.
   * @returns {FlyBase}
   */
  asXML: function () {
    return this.accept('text/xml')
  },
  /**
   * Return a promise for the response (including status code and headers), rather than for just the response data.
   * @returns {FlyBase}
   */
  enrichResponse: function () {
    this._raw = true
    return this
  },
  /**
   * Makes this request cache for ttl milliseconds.
   * @param {Number} [ttl=forever]
   * @returns {FlyBase}
   */
  cache: function (ttl) {
    this._cache = util.isNumeric(ttl) ? ttl : -1
    return this
  },
  processData: function (processData) {
    this._processData = processData
    return this
  },
  /**
   * Alias for query().
   * @return {FlyBase}
   */
  q: function () {
    return this.query.apply(this, arguments)
  },
  /**
   * Alias for path().
   * @return {FlyBase}
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

function buildUrl (path, params) {
  let url = path.join('/')

  const paramsKeys = Object.keys(params)

  if (paramsKeys.length > 0) {
    let queryParams = []
    paramsKeys.forEach(function (key) {
      let val = params[key]
      if (!util.isArray(val)) {
        val = [val]
      }
      // Query param values that are lists (e.g. tag: [1, 2, 3]) should be sent as tag=1&tag=2&tag=3 to match the API.
      val.forEach(function (valItem) {
        queryParams.push(encodeURIComponent(key) + '=' + encodeURIComponent(valItem))
      })
    })

    url += '?' + queryParams.join('&')
  }

  return url
}

export default FlyBase
