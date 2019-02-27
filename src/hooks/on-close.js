import _ from 'lodash'

module.exports = (fastify) => {
  fastify.addHook('onClose', (instance, next) => {
    logger.info('into onClose hook with instance =', instance, 'next =', next)

    if (next && _.isFunction(next)) {
      next()
    }
  })
}
