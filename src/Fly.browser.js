import FlyBase from './Fly.base'

/**
 * RequestBuilder for the browser.
 * @extends Request
 * @constructor
 */
function FlyBrowser () {
  FlyBase.call(this)
}

FlyBrowser.clearCache = function () {
  FlyBase.clearCache()
}

FlyBrowser.prototype = Object.create(FlyBase.prototype)

/**
 * Download GET request as file.
 * @param filename
 * @returns {Promise}
 */
FlyBrowser.prototype.download = function (filename) {
  console.warn('Browser does not support dowload yet.')
  // this._downloadAsFilename = filename || this._path[this._path.length - 1]
  // return this.header('Content-Type', 'application/octet-stream').send('GET')
}

FlyBrowser.prototype._sendRequest = function (url, method, body, headers) {
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

FlyBrowser.prototype._browserRequest = function (url, method, body, headers) {
  let me = this
  return new Promise(function (resolve, reject) {
    let form
    const config = {
      credentials: 'same-origin',
      method: method,
      headers: headers
    }
    if (me._formData.length) {
      form = new FormData()
      me._formData.forEach(function (formFieldArguments) {
        form.append.apply(form, formFieldArguments)
      })
    }
    if (form || body) {
      config.body = form || body
    }
    me._xhr = window.fetch(url, config)
      .then(function (res) {
        let p
        if (res.headers.get('Content-Type').indexOf('application/json') !== -1) {
          p = res.json()
        } else if (res.headers.get('Content-Type').indexOf('application/octet-stream') !== -1) {
          console.warn('Browser does not support dowload yet.')
          p = res.text()
        } else {
          p = res.text()
        }
        p.then(function (data) {
          res.data = data === undefined ? null : data
          if (res.ok) {
            resolve(res)
          } else {
            reject(res)
          }
        })
      })
      .catch(function (err) {
        reject(err)
      })
  })
}

export default FlyBrowser
