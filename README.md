# fastify-api-logger

[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat)](https://standardjs.com/)

Simple and straightforward API request/response single line data logging for Fastify.

## Install

`npm install --save fastify-api-logger`

## Usage

```js
const fastify = require('fastify')

fastify.register(require('fastify-api-logger'))

// log format: [ip] [user id?] [method] [status code] [path] [response time] [request payload?] [reply payload]
```

## Demo

![fastify-api-logger](https://raw.githubusercontent.com/shaunlee/fastify-api-logger/master/demo.png)

## License

Licensed under [MIT](./LICENSE)
