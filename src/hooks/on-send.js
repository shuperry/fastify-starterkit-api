import _ from 'lodash'

module.exports = (fastify) => {
  fastify.addHook('onSend', (request, reply, payload, next) => {
    logger.info('into onSend hook')

    if (next && _.isFunction(next)) {
      next()
    }
  })
}
