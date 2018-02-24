module.exports = (fastify) => {
  fastify.addHook('onClose', (instance, done) => {
    logger.info('into onClose hook with instance =', instance, 'done =', done)
  })
}
