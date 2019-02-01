export default (fastify) => {
  const middlewares = config.get('middlewares')

  middlewares.forEach(middleware => {
    logger.info('loading middleware:', middleware)

    if (config.get(`switches:middleware:${middleware}`) === false) {
      logger.warn(middleware, `服务未开启, 如要使用此服务, 请开启 switches:middleware:${middleware} 开关.`)
    } else {
      fastify.use(require(middleware)(config.get(`middleware:${middleware}`)))
    }
  })
}
