export default (fastify) => {
  const plugins = config.get('plugins')

  plugins.forEach(pluginName => {
    logger.info('loading plugin:', pluginName)

    if (config.get(`switches:plugin:${pluginName}`) === false) {
      logger.warn(pluginName, `服务未开启, 如要使用此服务, 请开启 switches:plugin:${pluginName} 开关.`)
    } else {
      fastify.register(require(`../plugins/${pluginName}`), config.get(`plugin:${pluginName}`))
    }
  })
}
