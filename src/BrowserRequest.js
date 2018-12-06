import Request from './Request'
import FileSaver from 'file-saver'
import utils from './utils'

/**
 * BrowserRequest.
 * @extends Request
 * @constructor
 */
function BrowserRequest () {
  Request.call(this)
}

BrowserRequest.clearCache = function () {
  Request.clearCache()
}

BrowserRequest.prototype = Object.create(Request.prototype)

/**
 * Download GET request as file.
 * @param filename
 * @returns {Promise}
 */
BrowserRequest.prototype.download = function (fileName) {
  this._download = true
  this._downloadAsFilename = fileName
  if (!fileName) {
    const pathArray = this._path[this._path.length - 1].split('/')
    this._downloadDefaultFilename = pathArray[pathArray.length - 1]
  }
  return this.send('GET')
}

/**
 * Set Fetch API credentials option.
 * @param {'same-origin'|'include'|'omit'} credentials
 * @returns {BrowserRequest}
 */
BrowserRequest.prototype.credentials = function (credentials) {
  if (['same-origin', 'include', 'omit'].includes(credentials)) {
    this._credentials = credentials
  } else {
    console.warn('credentials must be one of same-origin, include or omit')
  }
  return this
}

/**
 * Set Fetch API mode option.
 * @param {'navigate'|'same-origin'|'no-cors'|'cors'} mode
 * @returns {BrowserRequest}
 */
BrowserRequest.prototype.mode = function (mode) {
  if (['navigate', 'same-origin', 'no-cors', 'cors'].includes(mode)) {
    this._mode = mode
  } else {
    console.warn('mode must be one of navigate, same-origin, no-cors or cors')
  }
  return this
}

BrowserRequest.prototype._sendRequest = function (url, method, body, headers) {
  return this._browserRequest(url, method, body, headers)
    .then(function (response) {
      return {
        data: response.data ? response.data : null,
        status: response.status,
        headers: response.headers
      }
    })
    .catch(function (response) {
      return Promise.reject({
        data: response.data ? response.data : null,
        status: response.status,
        message: 'HTTP Request failed with status code:' + response.status,
        headers: response.headers
      })
    })
}

BrowserRequest.prototype._browserRequest = function (url, method, body, headers) {
  return new Promise((resolve, reject) => {
    let form
    const config = {
      credentials: this._credentials,
      mode: this._mode,
      method: method,
      headers: headers
    }
    if (utils.isString(this._formUrl) && this._formUrl.length) {
      form = this._formUrl
    }
    if (this._formData.length) {
      form = new FormData()
      this._formData.forEach(function (formFieldArguments) {
        form.append.apply(form, formFieldArguments)
      })
    }
    if (form || body) {
      config.body = form || body
    }
    this._xhr = window.fetch(url, config)
      .then(res => {
        let p
        if (res.headers.get('Content-Type').includes('application/json')) {
          p = res.json()
        } else if (this._download) {
          p = res.blob()
        } else {
          p = res.text()
        }
        p.then(data => {
          res.data = data === undefined ? null : data
          if (res.ok) {
            if (this._download) {
              FileSaver.saveAs(data,
                this._downloadAsFilename ||
                utils.getHeaderFilename(res.headers) ||
                this._downloadDefaultFilename)
            }
            resolve(res)
          } else {
            reject(res)
          }
        })
      })
      .catch(err => {
        reject(err)
      })
  })
}

export default BrowserRequest
