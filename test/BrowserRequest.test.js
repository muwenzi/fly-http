import BrowserRequest from '../src/BrowserRequest'
import http from '../index'

describe('response handling', () => {
  let respond

  beforeEach(() => {
    spyOn(BrowserRequest.prototype, '_browserRequest').and.callFake(() => {
      return new Promise(function (resolve, reject) {
        respond = function (body, status, headers) {
          if (!status || (status >= 200 && status < 300)) {
            resolve({
              data: body,
              status: status,
              headers: headers
            })
          } else {
            reject({
              status: status,
              headers: headers
            })
          }
        }
      })
    })
  })

  it('with enrichResponse() should return a promise for the normalized response data.', done => {
    let request = http
      .p('hest')
      .enrichResponse()
      .get()

    respond({ pony: true }, 200, { 'x-pony': 'Yes' })

    request.then(function (response) {
      expect(response).toEqual({
        data: { pony: true },
        status: 200,
        headers: { 'x-pony': 'Yes' }
      })
      done()
    })
  })

  it('should return a promise for the response data.', done => {
    let request = http
      .p('hest')
      .get()

    respond({ pony: true })

    request.then(function (response) {
      expect(response).toEqual({ pony: true })
      done()
    })
  })

  it('should return a promise that rejects on errors.', done => {
    let request = http
      .p('hest')
      .get()

    respond('Internal pony error', 500, { 'x-pony': 'Yes' })

    request.catch(function (response) {
      expect(response).toEqual(
        jasmine.objectContaining({
          data: null,
          status: 500,
          headers: { 'x-pony': 'Yes' }
        })
      )
      done()
    })
  })

  it('should return a promise that rejects with null on 404.', done => {
    let request = http
      .p('hest')
      .get()

    respond(null, 404)

    request.catch(function (response) {
      expect(response.data).toEqual(null)
      done()
    })
  })
})

describe('request', () => {
  beforeEach(() => {
    spyOn(BrowserRequest.prototype, '_sendRequest').and.returnValue(
      new Promise(function (resolve, reject) {
        resolve({})
      })
    )
  })

  describe('Accept header', () => {
    it('should default to "application/json".', () => {
      http
        .p('hest')
        .get()

      let headers = BrowserRequest.prototype._sendRequest.calls.mostRecent().args[3]
      expect(headers['Accept']).toBe('application/json')
    })

    it('should be set to "text/plain" when calling asText().', () => {
      http
        .p('hest')
        .asText()
        .get()

      let headers = BrowserRequest.prototype._sendRequest.calls.mostRecent().args[3]
      expect(headers['Accept']).toBe('text/plain')
    })

    it('should be set to "text/xml" when calling asXML().', () => {
      http
        .p('hest')
        .asXML()
        .get()

      let headers = BrowserRequest.prototype._sendRequest.calls.mostRecent().args[3]
      expect(headers['Accept']).toBe('text/xml')
    })
  })

  describe('URL', () => {
    it('should consist of appended p() calls.', () => {
      http
        .p('hest')
        .p(1)
        .p('pony')
        .get()

      let url = BrowserRequest.prototype._sendRequest.calls.mostRecent().args[0]
      expect(url).toBe('hest/1/pony')
    })

    it('should use query parameters.', () => {
      http
        .p('hest')
        .q('pony', true)
        .q('text', 'ab&=cd')
        .get()

      let url = BrowserRequest.prototype._sendRequest.calls.mostRecent().args[0]
      expect(url).toBe('hest?pony=true&text=ab' + encodeURIComponent('&=') + 'cd')
    })

    it('should be able to set query parameter with an object hash', () => {
      http
        .p('hest')
        .queryAll({ pony: true, text: 'ab&=cd' })
        .get()
      let url = BrowserRequest.prototype._sendRequest.calls.mostRecent().args[0]
      expect(url).toBe('hest?pony=true&text=ab' + encodeURIComponent('&=') + 'cd')
    })

    it('should send identically named query parameters as repeated keys.', () => {
      http
        .p('hest')
        .q('tag', ['awesome', 'little'])
        .get()

      let url = BrowserRequest.prototype._sendRequest.calls.mostRecent().args[0]
      expect(url).toContain('hest?tag=awesome&tag=little')
    })

    it('should not send query params with undefined value', () => {
      http
        .p('hest')
        .q('tag', undefined)
        .get()

      let url = BrowserRequest.prototype._sendRequest.calls.mostRecent().args[0]
      expect(url).not.toContain('tag=undefined')
    })

    it('should not send query params with null value', () => {
      http
        .p('hest')
        .q('tag', null)
        .get()

      let url = BrowserRequest.prototype._sendRequest.calls.mostRecent().args[0]
      expect(url).not.toContain('tag=null')
    })
  })

  describe('body', () => {
    it('should be JSON data for POST by default.', () => {
      let data = { hest: true, pony: 'awesome' }
      http
        .p('hest')
        .post(data)

      let body = BrowserRequest.prototype._sendRequest.calls.mostRecent().args[2]
      expect(body).toEqual(JSON.stringify(data))
    })

    it('should be JSON data for PUT by default.', () => {
      let data = { hest: true, pony: 'awesome' }
      http
        .p('hest')
        .put(data)

      let body = BrowserRequest.prototype._sendRequest.calls.mostRecent().args[2]
      expect(body).toEqual(JSON.stringify(data))
    })
  })

  describe('caching', () => {
    afterEach(() => {
      BrowserRequest.clearCache()
    })

    it('should cache GET requests if asked to do so', () => {
      http
        .p('hest')
        .cache()
        .get()
      http
        .p('hest')
        .cache()
        .get()

      expect(BrowserRequest.prototype._sendRequest.calls.count()).toBe(1)
    })

    it('should set ttl', () => {
      let ttl = 10000
      let req = http
        .p('hest')
        .cache(ttl)
      expect(req._cache).toBe(ttl)
    })

    it('should use default ttl for non-numbers', () => {
      let DEFAULT_TTL = -1
      let invalidTTLs = ['a', true, false]
      invalidTTLs.forEach(function (ttl) {
        let req = http
          .p('hest')
          .cache(ttl)
        expect(req._cache).toBe(DEFAULT_TTL)
      })
    })

    it('cache is automatically evicted after cache expires', done => {
      http
        .p('hest')
        .cache(10)
        .get()
      http
        .p('hest')
        .cache(10)
        .get()

      expect(BrowserRequest.prototype._sendRequest.calls.count()).toBe(1)

      setTimeout(() => {
        expect(BrowserRequest.prototype._sendRequest.calls.count()).toBe(1)

        http
          .p('hest')
          .cache()
          .get()

        expect(BrowserRequest.prototype._sendRequest.calls.count()).toBe(2)

        done()
      }, 15)
    })

    it('should throw if asked to cache non-GET requests', () => {
      expect(() => {
        http
          .p('hest')
          .cache()
          .put()
      }).toThrow()

      expect(BrowserRequest.prototype._sendRequest.calls.count()).toBe(0)
    })
  })
  describe('FORM', () => {
    describe('append()', () => {
      const fieldName = 'fieldName'
      const fieldValue = 'fieldValue'
      it('should apeend form data and set the request body', () => {
        const instance = http.append(fieldName, fieldValue)
        expect(instance._formData.length).toEqual(1)
        expect(instance._formData[0][0]).toEqual(fieldName)
        expect(instance._formData[0][1]).toEqual(fieldValue)
      })
    })
    describe('formData()', () => {
      const data = {
        pony: true,
        text: 'abc'
      }
      it('should convert js object to a FormData and set the request body', () => {
        const instance = http.formData(data)
        expect(instance._formData.length).toEqual(2)
        expect(instance._formData[0][0]).toEqual('pony')
        expect(instance._formData[0][1]).toEqual(true)
        expect(instance._formData[1][0]).toEqual('text')
        expect(instance._formData[1][1]).toEqual('abc')
      })
    })
    describe('formUrl()', () => {
      const input = {
        pony: true,
        tim: { isFat: false }
      }
      it('should convert the input to an url encoded string', () => {
        const instance = http.formUrl(input)
        expect(instance._formUrl).toEqual('pony=true&tim=%7B%22isFat%22%3Afalse%7D')
      })
      it('should skip the conversion part if the input argument is already a string', () => {
        const alreadyEncodedForm = 'pony=true&tim=%7B%22isFat%22%3Afalse%7D'
        const instance = http.formUrl(alreadyEncodedForm)
        expect(instance._formUrl).toEqual('pony=true&tim=%7B%22isFat%22%3Afalse%7D')
      })
      it('should sets the content-type header and body', () => {
        const instance = http.formUrl(input)
        expect(instance._headers['Content-Type']).toEqual('application/x-www-form-urlencoded')
      })
    })
  })
})
