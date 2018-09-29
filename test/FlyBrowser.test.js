import Fly from '../src/FlyBrowser'
import fly from '..'

describe('response handling', () => {
  let respond

  beforeEach(() => {
    spyOn(Fly.prototype, '_browserRequest').and.callFake(() => {
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
    let request = fly
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
    let request = fly
      .p('hest')
      .get()

    respond({ pony: true })

    request.then(function (response) {
      expect(response).toEqual({ pony: true })
      done()
    })
  })

  it('should return a promise that rejects on errors.', done => {
    let request = fly
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
    let request = fly
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
    spyOn(Fly.prototype, '_sendRequest').and.returnValue(
      new Promise(function (resolve, reject) {
        resolve({})
      })
    )
  })

  describe('Accept header', () => {
    it('should default to "application/json".', () => {
      fly
        .p('hest')
        .get()

      let headers = Fly.prototype._sendRequest.calls.mostRecent().args[3]
      expect(headers['Accept']).toBe('application/json')
    })

    it('should be set to "text/plain" when calling asText().', () => {
      fly
        .p('hest')
        .asText()
        .get()

      let headers = Fly.prototype._sendRequest.calls.mostRecent().args[3]
      expect(headers['Accept']).toBe('text/plain')
    })

    it('should be set to "text/xml" when calling asXML().', () => {
      fly
        .p('hest')
        .asXML()
        .get()

      let headers = Fly.prototype._sendRequest.calls.mostRecent().args[3]
      expect(headers['Accept']).toBe('text/xml')
    })
  })

  describe('URL', () => {
    it('should consist of appended p() calls.', () => {
      fly
        .p('hest')
        .p(1)
        .p('pony')
        .get()

      let url = Fly.prototype._sendRequest.calls.mostRecent().args[0]
      expect(url).toBe('hest/1/pony')
    })

    it('should use query parameters.', () => {
      fly
        .p('hest')
        .q('pony', true)
        .q('text', 'ab&=cd')
        .get()

      let url = Fly.prototype._sendRequest.calls.mostRecent().args[0]
      expect(url).toBe('hest?pony=true&text=ab' + encodeURIComponent('&=') + 'cd')
    })

    it('should be able to set query parameter with an object hash', () => {
      fly
        .p('hest')
        .queryAll({ pony: true, text: 'ab&=cd' })
        .get()
      let url = Fly.prototype._sendRequest.calls.mostRecent().args[0]
      expect(url).toBe('hest?pony=true&text=ab' + encodeURIComponent('&=') + 'cd')
    })

    it('should send identically named query parameters as repeated keys.', () => {
      fly
        .p('hest')
        .q('tag', ['awesome', 'little'])
        .get()

      let url = Fly.prototype._sendRequest.calls.mostRecent().args[0]
      expect(url).toContain('hest?tag=awesome&tag=little')
    })

    it('should not send query params with undefined value', () => {
      fly
        .p('hest')
        .q('tag', undefined)
        .get()

      let url = Fly.prototype._sendRequest.calls.mostRecent().args[0]
      expect(url).not.toContain('tag=undefined')
    })

    it('should not send query params with null value', () => {
      fly
        .p('hest')
        .q('tag', null)
        .get()

      let url = Fly.prototype._sendRequest.calls.mostRecent().args[0]
      expect(url).not.toContain('tag=null')
    })
  })

  describe('body', () => {
    it('should be JSON data for POST by default.', () => {
      let data = { hest: true, pony: 'awesome' }
      fly
        .p('hest')
        .post(data)

      let body = Fly.prototype._sendRequest.calls.mostRecent().args[2]
      expect(body).toEqual(JSON.stringify(data))
    })

    it('should be JSON data for PUT by default.', () => {
      let data = { hest: true, pony: 'awesome' }
      fly
        .p('hest')
        .put(data)

      let body = Fly.prototype._sendRequest.calls.mostRecent().args[2]
      expect(body).toEqual(JSON.stringify(data))
    })
  })

  describe('caching', () => {
    afterEach(() => {
      Fly.clearCache()
    })

    it('should cache GET requests if asked to do so', () => {
      fly
        .p('hest')
        .cache()
        .get()
      fly
        .p('hest')
        .cache()
        .get()

      expect(Fly.prototype._sendRequest.calls.count()).toBe(1)
    })

    it('should set ttl', () => {
      let ttl = 10000
      let req = fly
        .p('hest')
        .cache(ttl)
      expect(req._cache).toBe(ttl)
    })

    it('should use default ttl for non-numbers', () => {
      let DEFAULT_TTL = -1
      let invalidTTLs = ['a', true, false]
      invalidTTLs.forEach(function (ttl) {
        let req = fly
          .p('hest')
          .cache(ttl)
        expect(req._cache).toBe(DEFAULT_TTL)
      })
    })

    it('cache is automatically evicted after cache expires', done => {
      fly
        .p('hest')
        .cache(10)
        .get()
      fly
        .p('hest')
        .cache(10)
        .get()

      expect(Fly.prototype._sendRequest.calls.count()).toBe(1)

      setTimeout(() => {
        expect(Fly.prototype._sendRequest.calls.count()).toBe(1)

        fly
          .p('hest')
          .cache()
          .get()

        expect(Fly.prototype._sendRequest.calls.count()).toBe(2)

        done()
      }, 15)
    })

    it('should throw if asked to cache non-GET requests', () => {
      expect(() => {
        fly
          .p('hest')
          .cache()
          .put()
      }).toThrow()

      expect(Fly.prototype._sendRequest.calls.count()).toBe(0)
    })
  })
  describe('FORM', () => {
    describe('append()', () => {
      const fieldName = 'fieldName'
      const fieldValue = 'fieldValue'
      it('should set the request header correctly', () => {
        const instance = fly.append(fieldName, fieldValue)
        expect(instance._headers['Content-Type']).toEqual('multipart/form-data')
      })
      it('should apeend form data and set the request body', () => {
        const instance = fly.append(fieldName, fieldValue)
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
      it('should set the request header correctly', () => {
        const instance = fly.formData(data)
        expect(instance._headers['Content-Type']).toEqual('multipart/form-data')
      })
      it('should convert js object to a FormData and set the request body', () => {
        const instance = fly.formData(data)
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
        const instance = fly.formUrl(input)
        expect(instance._formUrl).toEqual('pony=true&tim=%7B%22isFat%22%3Afalse%7D')
      })
      it('should skip the conversion part if the input argument is already a string', () => {
        const alreadyEncodedForm = 'pony=true&tim=%7B%22isFat%22%3Afalse%7D'
        const instance = fly.formUrl(alreadyEncodedForm)
        expect(instance._formUrl).toEqual('pony=true&tim=%7B%22isFat%22%3Afalse%7D')
      })
      it('should sets the content-type header and body', () => {
        const instance = fly.formUrl(input)
        expect(instance._headers['Content-Type']).toEqual('application/x-www-form-urlencoded')
      })
    })
  })
})
