import _ from 'lodash'

class BaseHelper {
  constructor() {

  }

  generateConditionForKeyText({where = {}, attributes = [], keyText}) {
    if (keyText) {
      const or = []
      let condition
      attributes.forEach(attribute => {
        condition = {}
        condition[attribute] = {$like: `%${keyText}%`}
        or.push(condition)
      })

      where['$or'] = or
    }
  }

  generateConditionForFuzzyLike({where, params = {}}) {
    _.keys(params).forEach(key => {
      if (params[key]) where[key] = {$like: `%${params[key]}%`}
    })
  }

  generateConditionForEqual({where, params = {}}) {
    _.keys(params).forEach(key => {
      if (params[key]) where[key] = params[key]
    })
  }

  /**
   * @description 封装自动挂载查询日期区间条件.
   *
   * @param where 需要挂载的条件.
   * @param params 示例:
      {
        start_at: '1524844800000', // 需查询的开始时间.
        start_at_operate: '$gte', // 查询开始时间时的条件, 支持 $gt ( > )、$gte ( >= )(默认).
        end_at: '1524844800001', // 需查询的结束时间.
        end_at_operate: '$lte', // 查询结束时间时的条件, 支持 $lt ( < )、$lte ( <= )(默认).
        fieldName: 'created_at' // 需查询的字段.
      }
   * 以上例子生成的 sql 是: (`xx`.`created_at` >= '2018-04-28 00:00:00.000' AND `xx`.`created_at` <= '2018-04-28 00:00:00.001')
   */
  generateConditionForFilterRangeTimeFields({where, params = []}) {
    params.forEach(v => {
      logger.info('into generateConditionForTimeFields with v =', v)

      if (!v.fieldName) {
        logger.warn('Missing fieldName for generateConditionForFilterRangeTimeFields function.')
      }

      if (v.start_at || v.end_at) {
        where[v.fieldName] = {}

        if (v.start_at) {
          where[v.fieldName][v.start_at_operate || '$gte'] = v.start_at
        }

        if (v.end_at) {
          where[v.fieldName][v.end_at_operate || '$lte'] = v.end_at
        }
      }
    })
  }
}

export default BaseHelper
