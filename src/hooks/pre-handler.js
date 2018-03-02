import _ from 'lodash'
import moment from 'moment'

import StringUtil from '../utils/string-util'

const jwtErrorMessageMap = {
  MissJsonWebTokenError: '缺失 token 参数, 请登录',
  JsonWebTokenError: '非法 token, 请登录',
  TokenExpiredError: 'token 已失效, 请重新登录'
}

const loggerForBeginVisitUrl = ({fastify, request}) => {
  const beginVisitTime = moment(moment(), 'YYYY-MM-DD HH:mm:ss SSS')
  fastify.server.beginVisitTime = beginVisitTime

  if (request && request.raw) {
    let params
    if ('GET' === request.raw.method) {
      params = _.extend({}, request.params || {}, request.query || {})
    } else if (_.includes(['POST', 'PUT', 'PATCH', 'DELETE'], request.raw.method)) {
      params = request.body
    }

    logger.info(
      'begin visiting url at',
      beginVisitTime.format('YYYY-MM-DD HH:mm:ss SSS'), '=>',
      `[${request.raw.method}]`, request.raw.url,
      'with data =>', params,
      '\n header.authorization =>', request.headers && request.headers.authorization ? request.headers.authorization : '')
  }
}

const checkAuthority = ({fastify, request, reply}) => {
  const authIgnoreUrls = config.get('auth:ignore_urls') || []
  const matchedIgnoreUrls = []
  authIgnoreUrls
    .filter(urlPath => new RegExp(`^${urlPath}.*`).test(request.raw.url))
    .forEach(urlPath => matchedIgnoreUrls.push(urlPath))

  // ignore_urls in config ignore check authority.
  if (matchedIgnoreUrls.length === 0) {
    // pass_urls in config pass check authority.
    const authPassUrls = config.get('auth:pass_urls') || []
    const matchedPassUrls = []

    authPassUrls
      .filter(urlPath => new RegExp(`^${urlPath}.*`).test(request.raw.url))
      .forEach(urlPath => matchedPassUrls.push(urlPath))

    if (matchedPassUrls.length > 0) {
      if (StringUtil.isNotBlank(request.headers.authorization)) {
        try {
          const user = fastify.jwt.verify(request.headers.authorization, { passthrough: true })
          logger.info('current logged in user =', user)

          fastify.server.user = user
        } catch (e) {
          reply.code(401).send({
            error: jwtErrorMessageMap[e.name]
          })

          return
        }
      } else {
        reply.code(401).send({
          error: jwtErrorMessageMap['MissJsonWebTokenError']
        })

        return
      }
    }

    // only urls in config file need check authority.
    const matchedAuthUrls = []
    const authUrls = config.get('auth:urls') || []

    authUrls
      .filter(urlPath => new RegExp(`^${urlPath}.*`).test(request.raw.url))
      .forEach(urlPath => matchedAuthUrls.push(urlPath))

    if (matchedAuthUrls.length > 0) {
      if (StringUtil.isNotBlank(request.headers.authorization)) {
        try {
          const user = fastify.jwt.verify(request.headers.authorization)
          logger.info('current logged in user =', user)

          fastify.server.user = user
        } catch (e) {
          reply.code(401).send({
            error: jwtErrorMessageMap[e.name]
          })

          return
        }
      } else {
        reply.code(401).send({
          error: jwtErrorMessageMap['MissJsonWebTokenError']
        })

        return
      }
    } else { // if urls not in urls and passUrls, but has authorization in header, we check authority and passthrough.
      if (StringUtil.isNotBlank(request.headers.authorization)) {
        try {
          const user = fastify.jwt.verify(request.headers.authorization, { passthrough: true })
          logger.info('current logged in user =', user)

          fastify.server.user = user
        } catch (e) {
          logger.error('check authorization with err = ', e)

          reply.code(401).send({
            error: jwtErrorMessageMap[e.name]
          })

          return
        }
      }
    }
  }
}

module.exports = (fastify) => {
  fastify.addHook('preHandler', (request, reply, next) => {
    /**
     * some useful propertities.
     logger.info('into preHandler hook with request.raw.method =', request.raw.method)
     logger.info('into preHandler hook with request.raw.url =', request.raw.url)
     logger.info('into preHandler hook with request.raw.originalUrl =', request.raw.originalUrl)
     logger.info('into preHandler hook with request.params =', request.params)
     logger.info('into preHandler hook with request.query =', request.query)
     logger.info('into preHandler hook with request.body =', request.body)
     logger.info('into preHandler hook with request.headers =', request.headers)
     */

    loggerForBeginVisitUrl({fastify, request})

    checkAuthority({fastify, request, reply})

    fastify.server.request = request

    next()
  })
}
