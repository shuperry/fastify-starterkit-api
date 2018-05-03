import _ from 'lodash'

import BaseHelper from './common/base-helper'

class CategoryHelper extends BaseHelper {
  async getMeetings(fastify, {
    keyText, enabled, wechat_dept_id, name, place, description, remark, meeting_checkin_unit_id, start_begin_time, end_begin_time, start_finish_time, end_finish_time, created_by, updated_by, start_created_at, end_created_at, start_updated_at, end_updated_at, offset = 0, limit = config.get(
      'page:limit'), needPage = true
  }) {
    const {models} = fastify.sequelize

    const where = {}

    this.generateConditionForKeyText({
      where,
      attributes: [
        'name', 'place', 'description', 'remark'
      ],
      keyText
    })

    this.generateConditionForEqual({
      where,
      params: {
        enabled, created_by, updated_by
      }
    })

    this.generateConditionForFuzzyLike({
      where,
      params: {
        name, place, description, remark
      }
    })

    this.generateConditionForFilterRangeTimeFields({
      where,
      params: [
        {
          start_at: start_begin_time, end_at: end_begin_time, field: 'begin_time'
        },
        {
          start_at: start_finish_time, end_at: end_finish_time, field: 'finish_time'
        },
        {
          start_at: start_created_at, end_at: end_created_at, field: 'created_at'
        },
        {
          start_at: start_updated_at, end_at: end_updated_at, field: 'updated_at'
        }
      ]
    })

    const wechat_dept_id_or_sql = []
    if (!!wechat_dept_id) {
      wechat_dept_id.forEach((dep_id, idx) => {
        if (idx === 0) {
          wechat_dept_id_or_sql.push(`\`Meeting\`.\`wechat_dept_id\` LIKE '%|${dep_id}|%' `)
        } else {
          wechat_dept_id_or_sql.push(`OR \`Meeting\`.\`wechat_dept_id\` LIKE '%|${dep_id}|%'`)
        }
      })
    }

    if (!_.isBoolean(needPage) && _.isString(needPage)) {
      switch (needPage) {
        case 'true':
          needPage = true
          break
        case 'false':
          needPage = false
      }
    }

    const pagination = {}
    if (needPage) {
      pagination.offset = parseInt(offset)
      pagination.limit = parseInt(limit)
    }

    const select_sql = [
      'SELECT ',
      '      `Meeting`.`meeting_id` ',
      '  FROM ',
      '      `CRP_MEETING` AS `Meeting` ',
      ' WHERE `Meeting`.`is_public` = 1 '
    ]

    let sub_condition_sql_2 = []
    if (wechat_dept_id_or_sql.length > 0) {
      sub_condition_sql_2 = [
        '    OR (`Meeting`.`is_public` = 0 ',
        `          AND (${wechat_dept_id_or_sql.join('')})`,
        '    ) '
      ]
    }

    const order_sql = [
      'ORDER BY `Meeting`.`updated_at` DESC'
    ]

    const sql = [
      select_sql.join(''),
      sub_condition_sql_2.join(''),
      order_sql.join('')
    ].join('')

    const include_rows = (await fastify.sequelize.query(sql, {type: fastify.sequelize.QueryTypes.SELECT}))

    const include_meeting_ids = []
    include_rows.forEach(row => include_meeting_ids.push(row.meeting_id))

    if (include_meeting_ids.length > 0) {
      where['meeting_id'] = {
        $in: include_meeting_ids
      }
    }

    let rows = await models.Meeting.findAll({
      where,
      ...pagination,
      order: [
        [
          'updated_at',
          'DESC'
        ]
      ]
    })

    return {
      rows,
      count: rows.length
    }
  }

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
