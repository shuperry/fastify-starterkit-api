module.exports = (fastify) => {
  fastify.addHook('onRoute', (routeOptions) => {
    logger.info('binding route:', `[${routeOptions.method}]`, routeOptions.url)
  })
}
