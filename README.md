<p align="center">
    <br>
    <br>
    <br>
    <br>
    <img width="200" src="https://user-images.githubusercontent.com/12554487/45917080-caba8180-bea2-11e8-8e1b-f0e27f478883.png" alt="fly logo">
    <br>
    <br>
    <br>
    <br>
    <br>
    <br>
</p>

> Chained and declarative HTTP client based on the browser Fetch API

[![build status][travis-image]][travis-url]
[![npm version][npm-version-image]][npm-version-url]
[![npm downloads][npm-downloads-image]][npm-downloads-url]
[![license][license-image]][license-url]

## Features

- ✔︎ Chained and declarative api methods
- ✔︎ Based on the browser Fetch API
- ✔︎ Form support
- ✔︎ Download support

## Browser Support

The latest version of Chrome, Firefox, and Safari.

## Install

```sh
npm i fly-http
```

## Example

```js
import fly from 'fly-http'

(async () => {
    const res = await fly
      .p('https://cnodejs.org/api/v1')
      .p('topics')
      .q('page', 2)
      .q('tab', 'good')
      .q('limit', 5)
      .get()
    console.log('res', res)
})()
```

## API Preview

- **PATH**
  - [path][path-url](path: string | number)
  - [p][p-url](path: string | number)
- **QUERY**
  - [query][query-url](key: string, value: string | number | boolean | array)
  - [q][q-url](key: string, value: string | number | boolean | array)
  - [queryAll][queryAll-url](params: object)
- **HEADER**
  - [header][header-url](name: string, value: string | number | boolean)
  - [auth][auth-url](value: string)
  - [content][content-url](contentType: string)
    - [withText][withText-url]()
    - [withJson][withJson-url]()
  - [accept][accept-url](acceptType: string)
    - [asText][asText-url]()
    - [asXML][asXML-url]()
- **FORM**
  - [append][append-url](name: string, value: string | Blob, fileName?: string)
  - [formData][formData-url](data: object)
  - [formUrl][formUrl-url](url: object | string)
- **HTTP METHODS**
  - [send][send-url](method: string, body?: any)
  - [get][get-url]()
  - [post][post-url](body?: any)
  - [put][put-url](body?: any)
  - [patch][patch-url](body?: any)
  - [head][head-url]()
  - [delete][delete-url]()
- **CACHE**
  - [cache][cache-url](ttl: number)
  - [clearCache][clearCache-url]()
- **OTHER**
  - [beforeSend][beforeSend-url](callback: func)
  - [credentials][credentials-url](credentials: 'same-origin' | 'include' | 'omit')
  - [enrichResponse][enrichResponse-url]()
  - [download][download-url](fileName?: string)

## API Docs

### path(path: string | number)

Add path segment to request url including non-encoded path segment.

<details>
<summary>Examples</summary>

```js
fly
  .path('https://cnodejs.org')
  .path('api')
  .path('v1')
  .path('topics')
  .get()
```

you can also make one path with the slash:

```js
fly
  .path('https://cnodejs.org/api/v1/topics')
  .get()
```

</details>

<br>[⬆ Back to top][back-to-top-url]

### p(path: string | number)

Alias for path().

<details>
<summary>Examples</summary>

```js
fly
  .p('https://cnodejs.org')
  .p('api')
  .p('v1')
  .p('topics')
  .get()
```
</details>

<br>[⬆ Back to top][back-to-top-url]

### query(key: string, value: string | number | boolean | array)

Add query parameter to request url.

<details>
<summary>Examples</summary>

```js
fly
  .path('https://cnodejs.org/api/v1')
  .path('topics')
  .query('page', 2)
  .query('tab', 'good')
  .query('limit', 5)
  .get()
```

</details>

<br>[⬆ Back to top][back-to-top-url]

### q(key: string, value: string | number | boolean | array)

Alias for query().

<details>
<summary>Examples</summary>

```js
fly
  .p('https://cnodejs.org/api/v1')
  .p('topics')
  .q('page', 2)
  .q('tab', 'good')
  .q('limit', 5)
  .get()
```

</details>

<br>[⬆ Back to top][back-to-top-url]

### queryAll(params: object)

Accept object as params.

<details>
<summary>Examples</summary>

```js
fly
  .p('https://cnodejs.org/api/v1')
  .p('topics')
  .queryAll({
    'page': 2,
    'tab': 'good',
    'limit': 5
  })
  .get()
```

</details>

<br>[⬆ Back to top][back-to-top-url]

### header(name: string, value: string | number | boolean)

Add header to request.

<details>
<summary>Examples</summary>

```js
fly
  .p('account')
  .p('users')
  .p(userId)
  .p('state')
  .header('Content-Type', 'text/plain')
  .put('LOCKED');
```

You can also define custom header by this method:

```js
.header('X-TenantId', companyId)
```

</details>

<br>[⬆ Back to top][back-to-top-url]

### auth(value: string)

Convenience method for setting the "Authorization" header, same with:

```js
.header('Authorization', value)
```

<details>
<summary>Examples</summary>

```js
.auth('Bearer eyJhbGciOiJIUzI1NiIs')
```

</details>

<br>[⬆ Back to top][back-to-top-url]

### content(contentType: string)

Set the content type of the body.

<details>
<summary>Examples</summary>

```js
.content('multipart/form-data')
```

</details>

<br>[⬆ Back to top][back-to-top-url]

### withText()

Convenience method for sending data as plain text, same with:

```js
.content('text/plain')
```

[⬆ Back to top][back-to-top-url]

### withJson()

Convenience method for sending data as json, same with:

```js
.content('application/json')
```

[⬆ Back to top][back-to-top-url]

### accept(acceptType: string)

Set the Accept header.

<details>
<summary>Examples</summary>

```js
.accept('text/csv')
```

</details>

<br>[⬆ Back to top][back-to-top-url]

### asText()

Convenience method for getting plain text response, same with:

```js
.accept('text/plain')
```

[⬆ Back to top][back-to-top-url]

### asXML()

Convenience method for getting XML response, same with:

```js
.accept('text/plain')
```

[⬆ Back to top][back-to-top-url]

### append(name: string, value: string | Blob, fileName?: string)

Append formData params and set the content-type header to `multipart/form-data` automatically.

<details>
<summary>Examples</summary>

```js
fly
  .path('flipper/v0/flip')
  .path('order')
  .append('quotation', file)
  .accept('application/vnd.oasis.ubl+json')
  .post();
```

</details>

<br>[⬆ Back to top][back-to-top-url]

### formData(data: object)

Convert the javascript object to a FormData and set the content-type header to `multipart/form-data` automatically.

<details>
<summary>Examples</summary>

```js
const data = {
  pony: true,
  text: 'abc'
}
​
fly
  .path('...')
  .formData(data)
  .post()
```

</details>

<br>[⬆ Back to top][back-to-top-url]

### formUrl(input: object | string)

Convert the input to an url encoded string and set the content-type header to `application/x-www-form-urlencoded` automatically.

<details>
<summary>Examples</summary>

```js
const input = {
  pony: true,
  tim: { isFat: false }
}
const alreadyEncodedForm = 'pony=true&tim=%7B%22isFat%22%3Afalse%7D'
​
fly.path('...').formUrl(form).post()
fly.path('...').formUrl(alreadyEncodedForm).post()
```

</details>

<br>[⬆ Back to top][back-to-top-url]

### send(method: string, body?: any)

Send request.

supported methods:  POST, GET, POST, PUT, DELETE, PATCH, etc.

[⬆ Back to top][back-to-top-url]

### get()

Send GET request, same with:

```js
.send('GET', null)
```

[⬆ Back to top][back-to-top-url]

### post(body?: any)

Send POST request, same with:

```js
.send('POST', body)
```

[⬆ Back to top][back-to-top-url]

### put(body?: any)

Send PUT request, same with:

```js
.send('PUT', body)
```

[⬆ Back to top][back-to-top-url]

### patch(body?: any)

Send PATCH request, same with:

```js
.send('PATCH', body)
```

[⬆ Back to top][back-to-top-url]

### head()

Send HEAD request, same with:

```js
.send('HEAD', null)
```

[⬆ Back to top][back-to-top-url]

### delete()

Send DELETE request, same with:

```js
.send('DELETE', null)
```

[⬆ Back to top][back-to-top-url]

### cache(ttl: number)

Makes this request cache for ttl milliseconds.

[⬆ Back to top][back-to-top-url]

### clearCache()

Clear the request cache map.

<details>
<summary>Examples</summary>

```js
import { clearCache } from 'fly-http'
​
clearCache()
```

</details>

<br>[⬆ Back to top][back-to-top-url]

### beforeSend(callback: func)

Callback that gets invoked with string url before sending.

Note: It can only change headers and body of the request.

[⬆ Back to top][back-to-top-url]

### credentials(credentials: 'same-origin' | 'include' | 'omit')

Set Fetch API credentials option. The credentials option is `same-origin` by default, which is different from Fetch API.

<details>
<summary>Examples</summary>

```js
fly
  .p('...')
  .credentials('include')
  .post(body)
```

</details>

<br>[⬆ Back to top][back-to-top-url]

### enrichResponse()

Return a promise for the response (including status code and headers), rather than for just the response data.

<details>
<summary>Examples</summary>

```js
fly
  .path(url)
  .enrichResponse()
  .get()
```

</details>

<br>[⬆ Back to top][back-to-top-url]

### download(fileName?: string)

File will be named by following priority:

- High: download(fileName).
- Medium: response headers 'Content-Disposition' filename.
- Low: string after the last slash of path url.

<details>
<summary>Examples</summary>

```js
// file will be downloaded and named 'prop-types.js'
fly
  .p('https://cdn.bootcss.com/prop-types/15.6.1/prop-types.js')
  .download()
​
// file will be downloaded and named 'types.js'
fly
  .p('https://cdn.bootcss.com/prop-types/15.6.1/prop-types.js')
  .download('types.js')
​
// you can also download file by chained path style
fly
  .p('https://cdn.bootcss.com')
  .p('prop-types')
  .p('15.6.1')
  .p('prop-types.js')
  .download()

```

</details>

<br>[⬆ Back to top][back-to-top-url]

## Changelog

[CHANGELOG][changelog-url]

## License

MIT © [Kimi Gao](https://github.com/muwenzi)

[travis-url]: https://travis-ci.org/muwenzi/fly-http
[travis-image]: https://img.shields.io/travis/muwenzi/fly-http/master.svg?style=flat-square
[npm-version-url]: https://www.npmjs.com/package/fly-http
[npm-version-image]: https://img.shields.io/npm/v/fly-http.svg?style=flat-square
[npm-downloads-url]: https://www.npmjs.com/package/fly-http
[npm-downloads-image]: https://img.shields.io/npm/dt/fly-http.svg?style=flat-square
[license-url]: https://github.com/muwenzi/fly-http/blob/master/LICENSE
[license-image]: https://img.shields.io/github/license/muwenzi/fly-http.svg?style=flat-square
[changelog-url]: https://github.com/muwenzi/fly-http/blob/master/CHANGELOG.md
[back-to-top-url]: #api-preview
[path-url]: #pathpath-string--number
[p-url]: #ppath-string--number
[query-url]: #querykey-string-value-string--number--boolean--array
[q-url]: #qkey-string-value-string--number--boolean--array
[queryAll-url]: #queryallparams-object
[header-url]: #headername-string-value-string--number--boolean
[auth-url]: #authvalue-string
[content-url]: #contentcontenttype-string
[withText-url]: #withtext
[withJson-url]: #withjson
[accept-url]: #acceptaccepttype-string
[asText-url]: #astext
[asXML-url]: #asxml
[append-url]: #appendname-string-value-string--blob-filename-string
[formData-url]: #formdatadata-object
[formUrl-url]: #formurlinput-object--string
[send-url]: #sendmethod-string-body-any
[get-url]: #get
[post-url]: #postbody-any
[put-url]: #putbody-any
[patch-url]: #patchbody-any
[head-url]: #head
[delete-url]: #delete
[cache-url]: #cachettl-number
[clearCache-url]: #clearcache
[beforeSend-url]: #beforesendcallback-func
[credentials-url]: #credentialscredentials-same-origin--include--omit
[enrichResponse-url]: #enrichresponse
[download-url]: #downloadfilename-string
