<h1 align="center">
    <img width="436" src="https://user-images.githubusercontent.com/12554487/45538446-affc6300-b839-11e8-8074-0152dafd3d26.png" alt="fly.js logo">
    <br>
    <br>
</h1>

> Chaining and declarative HTTP client based on the browser Fetch API

[![build status][travis-image]][travis-url]
[![npm version][npm-version-image]][npm-version-url]
[![npm downloads][npm-downloads-image]][npm-downloads-url]
[![license][license-image]][license-url]

## Install

```sh
npm i fly.js
```

## Basic usage

```js
import fly from 'fly.js'

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


## Changelog

[CHANGELOG][changelog-url]

## License

MIT © [Kimi Gao](https://github.com/muwenzi)

[travis-url]: https://travis-ci.org/muwenzi/fly.js
[travis-image]: https://img.shields.io/travis/muwenzi/fly.js/master.svg?style=flat-square
[npm-version-url]: https://www.npmjs.com/package/fly.js
[npm-version-image]: https://img.shields.io/npm/v/fly.js.svg?style=flat-square
[npm-downloads-url]: https://www.npmjs.com/package/fly.js
[npm-downloads-image]: https://img.shields.io/npm/dt/fly.js.svg?style=flat-square
[license-url]: https://github.com/muwenzi/fly.js/blob/master/LICENSE
[license-image]: https://img.shields.io/github/license/muwenzi/fly.js.svg?style=flat-square
[changelog-url]: https://github.com/muwenzi/fly.js/blob/master/CHANGELOG.md
