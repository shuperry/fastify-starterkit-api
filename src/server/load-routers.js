import path from 'path'

import fsPlus from 'fs-plus'

export default (fastify) => {
  let router_path

  config.get('routers:versions').forEach(versioned_router => {
    router_path = path.join(__dirname, '..', 'routers', versioned_router.root_folder)

    if (versioned_router.enable) {
      fsPlus.listTreeSync(router_path)
        .filter(filePath => fsPlus.isFileSync(filePath) && path.extname(filePath) === '.js')
        .forEach(filePath => {
          logger.info(`loading router: ${filePath.substring(router_path.length, filePath.length - 3)}`)

          fastify.register(require(filePath).default, {
            prefix: config.get('routers:base_prefix') + versioned_router.prefix,
            logLevel: versioned_router.logLevel
          })
        })
    }
  })
}
