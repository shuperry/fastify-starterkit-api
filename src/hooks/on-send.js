module.exports = (fastify) => {
  fastify.addHook('onSend', (request, reply, payload, next) => {
    logger.info('into onSend hook')

    next()
  })
}
