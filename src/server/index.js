import ip from 'ip'

import loadMiddlewares from './load-middlewares'
import loadHooks from './load-hooks'
import loadPlugins from './load-plugins'
import loadRoutes from './load-routes'
import cacheStaticData from './cache-static-data'
import testSth from './test-sth'

import config from '../config'

global.g_api = {}

global.config = config

const logger = require('pino')(config.get('log'))
global.logger = logger

const fastify = require('fastify')({
  logger,
  // https: {
  //   allowHTTP1: true
  //   key: fs.readFileSync(path.join(__dirname, '../test/https/fastify.key')),
  //   cert: fs.readFileSync(path.join(__dirname, '../test/https/fastify.cert'))
  // }
})

fastify.addContentTypeParser('multipart/form-data', async (req, next) => {
  // 添加此步骤会导致表单请求进入两次 preHandler hook 的问题.
  // next()
})

loadMiddlewares(fastify)

loadHooks(fastify)

loadPlugins(fastify)

loadRoutes(fastify)

global.fastify = fastify

const port = config.get('port')

fastify.listen(port, '0.0.0.0', async (err) => {
  if (err) {
    logger.error(err)
    return
  }

  await cacheStaticData(fastify)

  await testSth(fastify)

  logger.info(`You can also visit server at http://${ip.address()}:${port}`)
})
