import _ from 'lodash'

import StoreGlobalDataUtil from '../utils/store-global-data-util'

export default async (fastify) => {
  await StoreGlobalDataUtil.storeGloabalCategories(fastify)

  console.log(_.omitBy({sid: 'cn.shperry', dept_id: null}, (v) => {
    return _.isNull(v)
  }))
}
