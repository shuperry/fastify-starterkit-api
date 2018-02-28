import moment from 'moment'

module.exports = (fastify) => {
  fastify.addHook('onResponse', (res, next) => {
    logger.info('into onResponse hook')

    // TODO 此处可对请求响应内容做统一处理.

    const request = fastify.server.request

    if (request && request.raw) {
      const finishVisitTime = moment(moment(), 'YYYY-MM-DD HH:mm:ss SSS')
      logger.info(
        'finish visiting url at', finishVisitTime.format('YYYY-MM-DD HH:mm:ss SSS'),
        'taking time', (finishVisitTime - fastify.server.beginVisitTime), 'ms =>',
        `[${request.raw.method}]`, request.raw.url
      )
    }

    next()
  })
}
