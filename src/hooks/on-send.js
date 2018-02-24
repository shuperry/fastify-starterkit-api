module.exports = (fastify) => {
  fastify.addHook('onSend', (request, reply, payload, next) => {
    logger.info('into onSend hook')

    fastify.server.request = request

    // TODO 此处可对请求参数做统一处理, 如增加 created_at、updated_at、created_by、updated_by.

    next()
  })
}
