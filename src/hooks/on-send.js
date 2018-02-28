module.exports = (fastify) => {
  fastify.addHook('onSend', (request, reply, payload, next) => {
    logger.info('into onSend hook with payload =', payload)

    // 如果请求返回有错误, 则不继续执行其它后续 hook.
    if (payload.error) {
      return
    }

    next()
  })
}
