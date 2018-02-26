import {transaction} from '../decorators/service-decorator'

import categoryHelper from '../helpers/category-helper'

class CategoryService {
  constructor() {

  }

  async getCategories(fastify, params) {
    return await categoryHelper.getCategories(fastify, params)
  }

  @transaction
  async createCategory(fastify, params) {
    const category = await categoryHelper.createCategory(fastify, params)

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
    const existingCategory = await categoryHelper.getCategoryById(fastify, params)

    if (!!existingCategory) {
      const category = await categoryHelper.updateCategory(
        fastify,
        params,
        existingCategory
      )

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
