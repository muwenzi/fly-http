import FlyBase from './Fly.base'
import FileSaver from 'file-saver'
import util from './util'

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
FlyBrowser.prototype.download = function (fileName) {
  this._download = true
  this._downloadAsFilename = fileName
  if (!fileName) {
    const pathArray = this._path[this._path.length - 1].split('/')
    this._downloadDefaultFilename = pathArray[pathArray.length - 1]
  }
  return this.send('GET')
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
        } else if (me._download) {
          p = res.blob()
        } else {
          p = res.text()
        }
        p.then(function (data) {
          res.data = data === undefined ? null : data
          if (res.ok) {
            if (me._download) {
              FileSaver.saveAs(data, me._downloadAsFilename || util.getHeaderFilename(res.headers) || me._downloadDefaultFilename)
            }
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
