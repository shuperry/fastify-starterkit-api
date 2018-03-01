module.exports = (fastify) => {
  fastify.addHook('onRoute', (routerOptions) => {
    logger.info('loading router:', `[${routerOptions.method}]`, routerOptions.url)
  })
}
