const fp = require('fastify-plugin')

async function apiLoggerPlugin (fastify, options) {
  options = {
    user: 'userId',
    level: 'debug',
    prettyPrint: true,

    ...options
  }

  const sensitiveUrls = options.sensitive_urls || []

  const logger = require('pino')({
    level: options.level,
    prettyPrint: options.prettyPrint
  })

  fastify.addHook('onRequest', async (request, reply) => {
    request.apiLogger = { t: process.hrtime(), req: '', res: '' }
  })

  fastify.addHook('preParsing', async (request, reply, payload) => {
    let data = ''
    payload.on('readable', () => {
      data += payload.read() || ''
    })
    payload.on('end', () => {
      request.apiLogger.req = data
    })
  })

  fastify.addHook('onSend', async (request, reply, payload) => {
    request.apiLogger.res = payload
  })

  fastify.addHook('onResponse', async (request, reply) => {
    const [s, n] = process.hrtime(request.apiLogger.t)
    const isSensitiveUrl = sensitiveUrls.indexOf(request.url) > -1;
    logger[(reply.statusCode >= 500) ? 'error' : (reply.statusCode >= 400) ? 'warn' : 'debug']({
      msg: [
        request.ip, request[options.user], request.method, reply.statusCode, request.url,
        (s > 0) ? `${(s + n / 1e9).toFixed(3)}s` : `${(n / 1e6).toFixed(3)}ms`,
        isSensitiveUrl ? null : request.apiLogger.req,
        isSensitiveUrl ? null : request.apiLogger.res
      ].filter(e => !!e).join(' ')
    })
  })
}

module.exports = fp(apiLoggerPlugin, {
  fastify: '>=3.0.0',
  name: 'fastify-api-logger'
})
