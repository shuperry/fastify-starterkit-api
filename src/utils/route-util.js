import _ from 'lodash'
import validate from 'validate.io'

class RouteUtil {
  constructor() {

  }

  static dealSpecialMultipartFormdataRouteParam(fastify) {
    let val
    _.keys(fastify.server.req.body).forEach(key => {
      val = fastify.server.req.body[key]

      if (validate.isJSON(val)) {
        fastify.server.req.body[key] = JSON.parse(val)
      }

      if (_.isString(val) && !validate.isJSON(val)) {
        if (val !== '') {
          if (_.isNumber(_.toNumber(val)) && !_.isNaN(_.toNumber(val))) {
            fastify.server.req.body[key] = _.toNumber(val)
          } else if (_.toLower(_.trim(val)) === 'undefined' || _.toLower(_.trim(val)) === 'null' || _.trim(val) === 'NaN') {
            /**
             * set un-normal value to null
             *
             * 1. 为支持部分字段从有值改为无值.
             */
            fastify.server.req.body[key] = null
          } else {
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
