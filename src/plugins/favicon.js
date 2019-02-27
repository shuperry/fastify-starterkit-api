import fs from 'fs'
import path from 'path'

module.exports = (fastify, opts, next) => {
  logger.info('loading favicon plugin with opts =', opts)

  fastify.get('/favicon.ico', {
    handler(request, reply) {
      const stream = fs.createReadStream(opts.path || path.join(config.get('appPath'), 'favicon.ico'))
      reply.type('image/x-icon').send(stream)
    }
  })

  next()
}
