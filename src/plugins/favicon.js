import fs from 'fs'
import path from 'path'

import fp from 'fastify-plugin'

const fastifyPlugin = (fastify, opts, next) => {
  logger.info('loading favicon plugin with opts =', opts)

  fastify.get('/favicon.ico', {
    handler(request, reply) {
      const stream = fs.createReadStream(opts.path || path.join(config.get('appPath'), 'favicon.ico'))
      reply.type('image/x-icon').send(stream)
    }
  })

  next()
}

module.exports = fp(fastifyPlugin, {
  fastify: '>=0.39',
  name: 'fastify-favicon'
})
