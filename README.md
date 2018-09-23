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

[Online API Docs][online-api-docs]

- PATH
  - **[path][path-url]**(path: string | number)
  - **[p][p-url]**(path: string | number)
  - **[pathRaw][pathRaw-url]**(path: string | number)
- QUERY
  - **[query][query-url]**(key: string, value: string | number | boolean | array)
  - **[q][q-url]**(key: string, value: string | number | boolean | array)
  - **[queryAll][queryAll-url]**(params: object)
- HEADER
  - **[header][header-url]**(name: string, val: string | number | boolean)
  - **[content][content-url]**(contentType: string)
  - **[withText][withText-url]**()
  - **[withJson][withJson-url]**()
  - **[accept][accept-url]**(acceptType: string)
  - **[asText][asText-url]**()
  - **[asXML][asXML-url]**()
- FORM
  - **[append][append-url]**(name: string, value: string | Blob, fileName?: string)
- HTTP METHODS
  - **[send][send-url]**(method: string, body: any)
  - **[get][get-url]**()
  - **[post][post-url]**(body: any)
  - **[put][put-url]**(body: any)
  - **[patch][patch-url]**(body: any)
  - **[head][head-url]**()
  - **[delete][delete-url]**()
- CACHE
  - **[cache][cache-url]**(ttl: number)
  - **[clearCache][clearCache-url]**()
- OTHER
  - **[beforeSend][beforeSend-url]**(callback: func)
  - **[enrichResponse][enrichResponse-url]**()
  - **[download][download-url]**(fileName?: string)

## Changelog

[CHANGELOG][changelog-url]

## License

MIT © [Kimi Gao](https://github.com/muwenzi)

[travis-url]: https://travis-ci.org/muwenzi/fly-http.js
[travis-image]: https://img.shields.io/travis/muwenzi/fly-http.js/master.svg?style=flat-square
[npm-version-url]: https://www.npmjs.com/package/fly-http.js
[npm-version-image]: https://img.shields.io/npm/v/fly-http.js.svg?style=flat-square
[npm-downloads-url]: https://www.npmjs.com/package/fly-http.js
[npm-downloads-image]: https://img.shields.io/npm/dt/fly-http.js.svg?style=flat-square
[license-url]: https://github.com/muwenzi/fly-http.js/blob/master/LICENSE
[license-image]: https://img.shields.io/github/license/muwenzi/fly-http.js.svg?style=flat-square
[changelog-url]: https://github.com/muwenzi/fly-http.js/blob/master/CHANGELOG.md
[online-api-docs]: https://fly-http.gitbook.io/api
[path-url]: https://fly-http.gitbook.io/api/path/path
[p-url]: https://fly-http.gitbook.io/api/path/p
[pathRaw-url]: https://fly-http.gitbook.io/api/path/pathraw
[query-url]: https://fly-http.gitbook.io/api/query/query
[q-url]: https://fly-http.gitbook.io/api/query/q
[queryAll-url]: https://fly-http.gitbook.io/api/query/queryAll
[header-url]: https://fly-http.gitbook.io/api/header/header
[content-url]: https://fly-http.gitbook.io/api/header/content
[withText-url]: https://fly-http.gitbook.io/api/header/withText
[withJson-url]: https://fly-http.gitbook.io/api/header/withJson
[accept-url]: https://fly-http.gitbook.io/api/header/accept
[asText-url]: https://fly-http.gitbook.io/api/header/asText
[asXML-url]: https://fly-http.gitbook.io/api/header/asXML
[append-url]: https://fly-http.gitbook.io/api/form/append
[send-url]: https://fly-http.gitbook.io/api/http-methods/send
[get-url]: https://fly-http.gitbook.io/api/http-methods/get
[post-url]: https://fly-http.gitbook.io/api/http-methods/post
[put-url]: https://fly-http.gitbook.io/api/http-methods/put
[patch-url]: https://fly-http.gitbook.io/api/http-methods/patch
[head-url]: https://fly-http.gitbook.io/api/http-methods/head
[delete-url]: https://fly-http.gitbook.io/api/http-methods/delete
[cache-url]: https://fly-http.gitbook.io/api/cache/cache
[clearCache-url]: https://fly-http.gitbook.io/api/cache/clearCache
[beforeSend-url]: https://fly-http.gitbook.io/api/other/beforesend
[enrichResponse-url]: https://fly-http.gitbook.io/api/other/enrichResponse
[download-url]: https://fly-http.gitbook.io/api/other/download
