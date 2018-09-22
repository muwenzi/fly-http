<p align="center">
    <br>
    <br>
    <br>
    <br>
    <img width="180" src="https://user-images.githubusercontent.com/12554487/45917080-caba8180-bea2-11e8-8e1b-f0e27f478883.png" alt="fly logo">
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
  - **path**(path: string | number)
  - **p**(path: string | number)
  - **pathRaw**(path: string | number)
- QUERY
  - **query**(key: string, value: string | number | boolean | array)
  - **q**(key: string, value: string | number | boolean | array)
  - **queryAll**
- HEADER
  - **header**
  - **contentType**
  - **withText**
  - **withJson**
  - **accepts**
  - **asText**
  - **asXML**
- FORM
  - **append**
- HTTP METHODS
  - **get**
  - **patch**
  - **post**
  - **put**
  - **head**
  - **delete**
  - **send**
- CACHE
  - **cache**
  - **clearCache**
- OTHER
  - **beforeSend**
  - **wrapResponse**
  - **download**

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
