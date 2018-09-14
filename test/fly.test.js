import Fly from '../src/Fly.browser'
import fly from '..'

describe('response handling', () => {
  let respond

  beforeEach(() => {
    spyOn(Fly.prototype, '_browserRequest').and.callFake(function () {
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

  it('with asFormattedResponse() should return a promise for the normalized response data.', function (done) {
    let request = fly
      .p('hest')
      .asFormattedResponse()
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

  it('should return a promise for the response data.', function (done) {
    let request = fly
      .p('hest')
      .get()

    respond({ pony: true })

    request.then(function (response) {
      expect(response).toEqual({ pony: true })
      done()
    })
  })

  it('should return a promise that rejects on errors.', function (done) {
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

  it('should return a promise that rejects with null on 404.', function (done) {
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

describe('request', function () {
  beforeEach(function () {
    spyOn(Fly.prototype, '_sendRequest').and.returnValue(
      new Promise(function (resolve, reject) {
        resolve({})
      })
    )
  })

  describe('Accept header', function () {
    it('should default to "application/json".', function () {
      fly
        .p('hest')
        .get()

      let headers = Fly.prototype._sendRequest.calls.mostRecent().args[3]
      expect(headers.accept).toBe('application/json')
    })

    it('should be set to "text/plain" when calling asText().', function () {
      fly
        .p('hest')
        .asText()
        .get()

      let headers = Fly.prototype._sendRequest.calls.mostRecent().args[3]
      expect(headers.accept).toBe('text/plain')
    })

    it('should be set to "text/xml" when calling asXML().', function () {
      fly
        .p('hest')
        .asXML()
        .get()

      let headers = Fly.prototype._sendRequest.calls.mostRecent().args[3]
      expect(headers.accept).toBe('text/xml')
    })
  })

  describe('URL', function () {
    it('should consist of appended p() calls.', function () {
      fly
        .p('hest')
        .p(1)
        .p('pony')
        .get()

      let url = Fly.prototype._sendRequest.calls.mostRecent().args[0]
      expect(url).toBe('hest/1/pony')
    })

    it('should use query parameters.', function () {
      fly
        .p('hest')
        .q('pony', true)
        .q('text', 'ab&=cd')
        .get()

      let url = Fly.prototype._sendRequest.calls.mostRecent().args[0]
      expect(url).toBe('hest?pony=true&text=ab' + encodeURIComponent('&=') + 'cd')
    })

    it('should be able to set query parameter with an object hash', function () {
      fly
        .p('hest')
        .queryAll({ pony: true, text: 'ab&=cd' })
        .get()
      let url = Fly.prototype._sendRequest.calls.mostRecent().args[0]
      expect(url).toBe('hest?pony=true&text=ab' + encodeURIComponent('&=') + 'cd')
    })

    it('should send identically named query parameters as repeated keys.', function () {
      fly
        .p('hest')
        .q('tag', ['awesome', 'little'])
        .get()

      let url = Fly.prototype._sendRequest.calls.mostRecent().args[0]
      expect(url).toContain('hest?tag=awesome&tag=little')
    })

    it('should not send query params with undefined value', function () {
      fly
        .p('hest')
        .q('tag', undefined)
        .get()

      let url = Fly.prototype._sendRequest.calls.mostRecent().args[0]
      expect(url).not.toContain('tag=undefined')
    })

    it('should not send query params with null value', function () {
      fly
        .p('hest')
        .q('tag', null)
        .get()

      let url = Fly.prototype._sendRequest.calls.mostRecent().args[0]
      expect(url).not.toContain('tag=null')
    })
  })

  describe('body', function () {
    it('should be JSON data for POST by default.', function () {
      let data = { hest: true, pony: 'awesome' }
      fly
        .p('hest')
        .post(data)

      let body = Fly.prototype._sendRequest.calls.mostRecent().args[2]
      expect(body).toEqual(JSON.stringify(data))
    })

    it('should be JSON data for PUT by default.', function () {
      let data = { hest: true, pony: 'awesome' }
      fly
        .p('hest')
        .put(data)

      let body = Fly.prototype._sendRequest.calls.mostRecent().args[2]
      expect(body).toEqual(JSON.stringify(data))
    })
  })

  describe('pathRaw', function () {
    it('should not double encode the path', function () {
      let path = 'This%2Fis%2Falready%2Fencoded'
      fly
        .pathRaw(path)
        .get()

      let requestedPath = Fly.prototype._sendRequest.calls.mostRecent().args[0]
      expect(requestedPath).toEqual(path)
    })
  })

  describe('caching', function () {
    afterEach(function () {
      Fly.clearCache()
    })

    it('should cache GET requests if asked to do so', function () {
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

    it('should set ttl', function () {
      let ttl = 10000
      let req = fly
        .p('hest')
        .cache(ttl)
      expect(req._cache).toBe(ttl)
    })

    it('should use default ttl for non-numbers', function () {
      let DEFAULT_TTL = -1
      let invalidTTLs = ['a', true, false]
      invalidTTLs.forEach(function (ttl) {
        let req = fly
          .p('hest')
          .cache(ttl)
        expect(req._cache).toBe(DEFAULT_TTL)
      })
    })

    it('cache is automatically evicted after cache expires', function (done) {
      fly
        .p('hest')
        .cache(10)
        .get()
      fly
        .p('hest')
        .cache(10)
        .get()

      expect(Fly.prototype._sendRequest.calls.count()).toBe(1)

      setTimeout(function () {
        expect(Fly.prototype._sendRequest.calls.count()).toBe(1)

        fly
          .p('hest')
          .cache()
          .get()

        expect(Fly.prototype._sendRequest.calls.count()).toBe(2)

        done()
      }, 15)
    })

    it('should throw if asked to cache non-GET requests', function () {
      expect(function () {
        fly
          .p('hest')
          .cache()
          .put()
      }).toThrow()

      expect(Fly.prototype._sendRequest.calls.count()).toBe(0)
    })
  })
})
