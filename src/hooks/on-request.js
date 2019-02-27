import _ from 'lodash'

module.exports = (fastify) => {
  fastify.addHook('onRequest', (req, res, next) => {
    logger.info('into onRequest hook')

    fastify.server.req = req
    fastify.server.res = res

    if (next && _.isFunction(next)) {
      next()
    }
  })
}
