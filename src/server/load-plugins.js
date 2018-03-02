export default (fastify) => {
  const plugins = [
    'accepts',
    'jwt',
    'response-time',
    'formbody',
    'redis',
    'sequelize',
    'nodemailer',
    'compress',
    'favicon',
    // 'mongoose',
    // 'static-server',
    // 'knexjs'
  ]

  plugins.forEach(pluginName => {
    logger.info('loading plugin:', pluginName)

    fastify.register(require(`../plugins/${pluginName}`), config.get(`plugin:${pluginName}`))
  })
}
