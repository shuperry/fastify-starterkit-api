import _ from 'lodash'

import categoryHelper from '../helpers/category-helper'

class StoreGlobalDataUtil {
  constructor() {
  }

  static async storeGloabalCategories(fastify) {
    let categoriesCodeMap = {},
      categoriesIdMap = {},
      categoryJson = {}

    const categories = await categoryHelper.getSimpleCategories(fastify, {})
    categories.forEach(category => {
      categoryJson = JSON.parse(JSON.stringify(category))

      if (!_.isEmpty(categoryJson.code)) {
        categoriesCodeMap[categoryJson.code] = categoryJson
      }
      categoriesIdMap[categoryJson.category_id] = categoryJson
    })

    fastify.categoriesCodeMap = categoriesCodeMap
    fastify.categoriesIdMap = categoriesIdMap
  }
}

export default StoreGlobalDataUtil
