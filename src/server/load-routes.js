import path from 'path'

import fsPlus from 'fs-plus'

import config from '../config'

export default (fastify) => {
  let route_path

  console.log('config.get(\'routes:versions\') = ', config.get('routes'))

  config.get('routes:versions').forEach(versioned_route => {
    route_path = path.join(__dirname, '..', 'routes', versioned_route.root_folder)

    if (versioned_route.enable) {
      fsPlus.listTreeSync(route_path)
        .filter(filePath => fsPlus.isFileSync(filePath) && path.extname(filePath) === '.js')
        .forEach(filePath => {
          logger.info(`loading route: ${filePath.substring(route_path.length, filePath.length - 3)}`)

          fastify.register(require(filePath).default, {
            prefix: config.get('routes:base_prefix') + versioned_route.prefix,
            logLevel: versioned_route.logLevel
          })
        })
    }
  })
}
