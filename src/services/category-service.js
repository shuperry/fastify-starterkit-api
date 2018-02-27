import {transaction} from '../decorators/service-decorator'

import categoryHelper from '../helpers/category-helper'

import StoreGlobalDataUtil from '../utils/store-global-data-util'

class CategoryService {
  constructor() {

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

    fastify.redis.store('category_', category.category_id, category)

    return category
  }

  async getCategoryById(fastify, params) {
    const {category_id} = params

    const category = await fastify.redis.get('category_', category_id) || await categoryHelper.getCategoryById(fastify, {category_id})

    if (!!category) {
      fastify.redis.store('category_', category.category_id, category)

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

      fastify.redis.store('category_', category.category_id, category)

      return category
    }

    return {
      flag: false,
      error_code: 'notExists'
    }
  }
}

export default new CategoryService()
