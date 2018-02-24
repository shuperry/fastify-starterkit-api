export default (fastify) => {
  const middlewares = [
    'cors',
    'dns-prefetch-control',
    'frameguard',
    'hide-powered-by',
    'hsts',
    'ienoopen',
    'x-xss-protection'
  ]

  middlewares.forEach(middleware => {
    logger.info('loading middleware: ', middleware)

    fastify.use(require(middleware)(config.get(`middleware:${middleware}`)))
  })
}
