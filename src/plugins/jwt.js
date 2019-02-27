import JwtUtil from '../utils/jwt-util'

module.exports = (fastify, opts, next) => {
  logger.info('loading jwt plugin with opts =', opts)

  fastify.decorate('jwt', new JwtUtil(opts.secret_key, opts.options))

  next()
}
