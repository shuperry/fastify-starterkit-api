import _ from 'lodash'
import isJSON from 'validate.io-json'

class RouteUtil {
  constructor() {

  }

  static dealSpecialMultipartFormdataRouteParam (fastify) {
    let val
    _.keys(fastify.server.req.body).forEach(key => {
      val = fastify.server.req.body[key]
      if (isJSON(val)) {
        fastify.server.req.body[key] = JSON.parse(val)
      }

      if (_.isString(fastify.server.req.body[key]) && !isJSON(fastify.server.req.body[key])) {
        if (fastify.server.req.body[key] !== '') {
          if (_.isNumber(_.toNumber(fastify.server.req.body[key])) && !_.isNaN(_.toNumber(fastify.server.req.body[key]))) {
            logger.info('into preHandler hook if 2 with key =', key, 'val =', fastify.server.req.body[key])

            fastify.server.req.body[key] = _.toNumber(fastify.server.req.body[key])
          } else if (_.toLower(_.trim(fastify.server.req.body[key])) === 'undefined' || _.toLower(_.trim(fastify.server.req.body[key])) === 'null' || _.trim(fastify.server.req.body[key]) === 'NaN') {
            logger.info('into preHandler hook if 3 with key =', key, 'val =', fastify.server.req.body[key])

            // delete un-normal value.
            fastify.server.req.body[key] = null
          }
        }
      }
    })
  }
}

export default RouteUtil
