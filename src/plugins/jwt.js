import fp from 'fastify-plugin'

import JwtUtil from '../utils/jwt-util'

const fastifyPlugin = (fastify, opts, next) => {
  logger.info('into jwt plugin with opts =', opts)

  fastify.decorate('jwt', new JwtUtil(opts.secret_key, opts.options))

  next()
}

module.exports = fp(fastifyPlugin, {
  fastify: '>=0.39',
  name: 'fastify-jwt'
})
