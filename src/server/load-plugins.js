export default (fastify) => {
  const plugins = config.get('plugins')
  let pluginConf = {}

  plugins.forEach(pluginName => {
    pluginConf = config.get(`plugin:${pluginName}`) || {}

    logger.info('loading plugin:', pluginName, 'pluginConf =', pluginConf)

    if (config.get(`switches:plugin:${pluginName}`) === false) { // 未配置开关默认开启服务.
      logger.warn(pluginName, `服务未开启, 如要使用此服务, 请开启 switches:plugin:${pluginName} 开关, 否则在调用服务时会报错.`)
    } else {
      fastify.register(require(`../plugins/${pluginName}`), pluginConf)
    }
  })
}
