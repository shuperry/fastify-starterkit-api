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
    // 'mongodb',
    // 'static-server',
    // 'knexjs'
  ]

  plugins.forEach(pluginName => {
    logger.info('loading plugin:', pluginName)

    fastify.register(require(`../plugins/${pluginName}`), config.get(`plugin:${pluginName}`))
  })
}
