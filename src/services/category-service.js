import {transaction} from '../decorators/service-decorator'

import StoreGlobalDataUtil from '../utils/store-global-data-util'

import categoryHelper from '../helpers/category-helper'

class CategoryService {
  constructor() {
    this.redisKeyPrefix = 'category_'
  }

  async getMeetings(fastify, params) {
    return await categoryHelper.getMeetings(fastify, params)
  }

  async getCategories(fastify, params) {
    return await categoryHelper.getCategories(fastify, params)
  }

  @transaction
  async createCategory(fastify, params) {
    if (params.parent_id) {
      const existingParentCategory = await categoryHelper.getCategoryById(fastify, {category_id: params.parent_id})

      if (!existingParentCategory) {
        return {
          flag: false,
          error_code: 'parentNotExists'
        }
      }
    }

    const category = await categoryHelper.createCategory(fastify, params)

    StoreGlobalDataUtil.storeGloabalCategories(fastify)

    fastify.redis.store({
      keyPrefix: this.redisKeyPrefix,
      key: category.category_id,
      objVal: category
    })

    return category
  }

  async getCategoryById(fastify, params) {
    const {category_id} = params

    const category = await fastify.redis.get({keyPrefix: this.redisKeyPrefix, key: category_id}) || await categoryHelper.getCategoryById(fastify, {category_id})

    if (!!category) {
      fastify.redis.store({
        keyPrefix: this.redisKeyPrefix,
        key: category.category_id,
        objVal: category
      })

      return category
    }

    return {
      flag: false,
      error_code: 'notExists'
    }
  }

  @transaction
  async updateCategory(fastify, params) {
    if (params.parent_id) {
      const existingParentCategory = await categoryHelper.getCategoryById(fastify, {category_id: params.parent_id})

      if (!existingParentCategory) {
        return {
          flag: false,
          error_code: 'parentNotExists'
        }
      }
    }

    const existingCategory = await categoryHelper.getCategoryById(fastify, params)

    if (!!existingCategory) {
      const category = await categoryHelper.updateCategory(
        fastify,
        params,
        existingCategory
      )

      StoreGlobalDataUtil.storeGloabalCategories(fastify)

      fastify.redis.store({
        keyPrefix: this.redisKeyPrefix,
        key: category.category_id,
        objVal: category
      })

      return category
    }

    return {
      flag: false,
      error_code: 'notExists'
    }
  }
}

export default new CategoryService()
