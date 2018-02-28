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

      if (_.isString(val) && !isJSON(val)) {
        if (val !== '') {
          if (_.isNumber(_.toNumber(val)) && !_.isNaN(_.toNumber(val))) {
            logger.info('into preHandler hook if 2 with key =', key, 'val =', val)

            fastify.server.req.body[key] = _.toNumber(val)
          } else if (_.toLower(_.trim(val)) === 'undefined' || _.toLower(_.trim(val)) === 'null' || _.trim(val) === 'NaN') {
            logger.info('into preHandler hook if 3 with key =', key, 'val =', val)

            // delete un-normal value.
            fastify.server.req.body[key] = null
          } else {
            logger.info('into preHandler hook else with key =', key, 'val =', val)

            /**
             * 1.此方法可以处理类 array 的字符串, eg: '["ab", 2, "cd"]'.
             * 2.其它不能被 json.parse 成功的字符串直接使用原值.
             */
            try {
              fastify.server.req.body[key] = JSON.parse(val)
            } catch (e) {
              fastify.server.req.body[key] = val
            }
          }
        }
      }
    })
  }
}

export default RouteUtil
