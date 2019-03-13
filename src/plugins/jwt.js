import fp from 'fastify-plugin'

import JwtUtil from '../utils/jwt-util'

module.exports = fp((fastify, opts, next) => {
  logger.info('loading jwt plugin with opts =', opts)

  fastify.decorate('jwt', new JwtUtil(opts.secret_key, opts.options))

  next()
})
