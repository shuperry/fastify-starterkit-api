import _ from 'lodash'

class CategoryHelper {
  async getCategories(fastify, {keyText, name, code, parent_id, category_id}) {
    const {models} = fastify.sequelize

    let categories
    if (!_.isUndefined(parent_id)) {
      categories = await models.Category.find({
        where: {
          category_id: parent_id
        },
        include: [
          {
            model: models.Category,
            as: 'descendents',
            hierarchy: true
          }
        ],
        order: [
          [
            {
              model: models.Category,
              as: 'descendents'
            },
            'rank',
            'ASC'
          ]
        ]
      })
    } else if (!_.isUndefined(category_id)) {
      categories = await models.Category.find({
        where: {
          category_id
        },
        include: [
          {
            model: models.Category,
            as: 'descendents',
            hierarchy: true
          }
        ],
        order: [
          [
            {
              model: models.Category,
              as: 'descendents'
            },
            'rank',
            'ASC'
          ]
        ]
      })
    } else if (!_.isUndefined(code)) {
      categories = await models.Category.find({
        where: {
          code
        },
        include: [
          {
            model: models.Category,
            as: 'descendents',
            hierarchy: true
          }
        ],
        order: [
          [
            {
              model: models.Category,
              as: 'descendents'
            },
            'rank',
            'ASC'
          ]
        ]
      })
    } else if (!_.isUndefined(name) || !_.isUndefined(keyText)) {
      const where = {}

      if (!_.isUndefined(name)) where['name'] = {$like: `%${name}%`}

      if (!_.isUndefined(keyText)) {
        where['$or'] = [
          {
            name: {$like: `%${keyText}%`}
          },
          {
            code: {$like: `%${keyText}%`}
          }
        ]
      }

      categories = await models.Category.findAll({
        where,
        include: [
          {
            model: models.Category,
            as: 'descendents',
            hierarchy: true
          }
        ],
        order: [
          [
            'rank',
            'ASC'
          ],
          [
            {
              model: models.Category,
              as: 'descendents'
            },
            'rank',
            'ASC'
          ]
        ]
      })
    } else {
      categories = await models.Category.findAll({
        hierarchy: true,
        order: [
          [
            'rank',
            'ASC'
          ]
        ]
      })
    }

    return categories
  }

  async getSimpleCategories(fastify, params) {
    const {models} = fastify.sequelize

    const {code, parent_id, level, category_id} = params

    const where = {}

    if (!_.isUndefined(code)) where['code'] = code
    if (!_.isUndefined(parent_id)) where['parent_id'] = parent_id
    if (!_.isUndefined(level)) where['level'] = level
    if (!_.isUndefined(category_id)) where['category_id'] = category_id

    return await models.Category.findAll({
      where,
      order: [
        [
          'updated_at',
          'DESC'
        ]
      ]
    })
  }

  async getCategoryById(fastify, {category_id}) {
    const {models} = fastify.sequelize

    const where = {category_id}

    return await models.Category.find({
      where,
      include: [
        {
          model: models.Category,
          as: 'descendents',
          hierarchy: true
        },
        {
          model: models.Category,
          as: 'parent'
        }
      ],
      order: [
        [
          {
            model: models.Category,
            as: 'descendents'
          },
          'rank',
          'ASC'
        ]
      ]
    })
  }

  async getCategoryByCode({code}) {
    const {models} = fastify.sequelize

    const where = {code}

    return await models.Category.find({
      where,
      include: [
        {
          model: models.Category,
          as: 'descendents',
          hierarchy: true
        },
        {
          model: models.Category,
          as: 'parent'
        }
      ],
      order: [
        [
          {
            model: models.Category,
            as: 'descendents'
          },
          'rank',
          'ASC'
        ]
      ]
    })
  }

  async createCategory(fastify, params) {
    const {models} = fastify.sequelize

    const category = await models.Category.create(params)

    return await this.getCategoryById(fastify, {category_id: category.category_id})
  }

  async updateCategory(fastify, params, existingCategory) {
    const category = await existingCategory.update(params)

    return await this.getCategoryById(fastify, {category_id: category.category_id})
  }
}

export default new CategoryHelper()
