import fs from 'fs'
import path from 'path'

import _ from 'lodash'
import Joi from '../../utils/joi-util'
import multer from 'multer'

import categoryService from '../../services/category-service'

import RouterUtil from '../../utils/router-util'

const moduleChName = '通用类别'

const upload = multer({dest: config.get('upload_path')})

export default (fastify, opts, next) => {
  fastify.get('/hello', {
    schema: {
      querystring: Joi.object({
        hello: Joi.number().map([0, 1])
      })
    },
    schemaCompiler: schema => data => Joi.validate(data, schema, { allowUnknown: true }),
    handler: async (request, reply) => {
      return {
        hello: 'hello world!'
      }
    }
  })

  fastify.post('/files', {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          name: {
            type: 'string'
          }
        }
      }
    },
    beforeHandler: [ // beforeHandler 函数只支持同步, 否则会出现提前进入 handler 函数的问题.
      (request, reply, next) => { // 上传文件.
        upload.fields([
          {
            name: 'files',
            maxCount: config.get('files:maxUploadCount')
          }
        ])(fastify.server.req, fastify.server.res, err => {
          if (err) {
            logger.error('upload file with err =', err)
            return
          }

          next()
        })
      },
      (request, reply, next) => { // 处理 multipart/form-data 表单中特殊的数据.
        RouterUtil.dealSpecialMultipartFormdataRouterParam(fastify)

        next()
      }
    ],
    handler: async (request, reply) => {
      console.log('into upload file done with fastify.server.req.files =', JSON.stringify(fastify.server.req.files))
      console.log('into upload file done with fastify.server.req.body =', fastify.server.req.body)

      return {
        flag: 'success'
      }
    }
  })

  fastify.get('/send-files', {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          name: {
            type: 'string'
          }
        }
      }
    },
    handler: async (request, reply) => {
      reply
      // .type('text/plain')
        .compress(fs.createReadStream(path.join(config.get('appPath'), 'package.json')))
    }
  })

  fastify.get('/categories', {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          keyText: {
            type: 'string'
          },
          name: {
            type: 'string'
          },
          code: {
            type: 'string'
          },
          parent_id: {
            type: 'integer'
          },
          category_id: {
            type: 'integer'
          }
        },
        // required: ['name']
      }
    },
    beforeHandler(request, reply, next) {
      logger.info('into get categories route beforeHandler hook')

      next()
    },
    handler: async (request, reply) => {
      const params = _.extend({}, request.params || {}, request.query || {})

      const result = await categoryService.getCategories(fastify, params)

      const messages = {
        notExists: `${moduleChName}不存在`
      }

      if (_.isPlainObject(result) && result.flag === false) {
        return {
          statusCode: (result.status_code || 400),
          error: (result.error_msg || messages[result.error_code])
        }
      } else {
        return {
          result,
          error: null
        }
      }
    }
  })

  fastify.post('/categories', {
    schema: {
      body: {
        type: 'object',
        properties: {
          rank: {
            type: 'number'
          },
          parent_id: {
            type: 'integer'
          }
        }
      }
    },
    handler: async (request, reply) => {
      const params = _.extend({}, request.body || {})

      const result = await categoryService.createCategory(fastify, params)

      const messages = {
        parentNotExists: `上级${moduleChName}不存在`
      }

      if (_.isPlainObject(result) && result.flag === false) {
        return {
          statusCode: (result.status_code || 400),
          error: (result.error_msg || messages[result.error_code])
        }
      } else {
        return {
          result,
          error: null
        }
      }
    }
  })

  fastify.patch('/categories/:category_id', {
    schema: {
      params: {
        type: 'object',
        properties: {
          category_id: {
            type: 'integer'
          }
        }
      },
      body: {
        type: 'object',
        properties: {
          name: {
            type: 'string'
          },
          rank: {
            type: 'number'
          },
          parent_id: {
            type: 'integer'
          }
        }
      }
    },
    handler: async (request, reply) => {
      const params = _.merge({}, request.params || {}, request.body || {})

      const result = await categoryService.updateCategory(fastify, params)

      const messages = {
        notExists: `${moduleChName}不存在`,
        parentNotExists: `上级${moduleChName}不存在`
      }

      if (_.isPlainObject(result) && result.flag === false) {
        return {
          statusCode: (result.status_code || 400),
          error: (result.error_msg || messages[result.error_code])
        }
      } else {
        return {
          result,
          error: null
        }
      }
    }
  })

  fastify.get('/categories/:category_id', {
    schema: {
      params: {
        type: 'object',
        properties: {
          category_id: {
            type: 'integer'
          }
        }
      }
    },
    handler: async (request, reply) => {
      const params = _.merge({}, request.params || {})

      const result = await categoryService.getCategoryById(fastify, params)

      const messages = {
        notExists: `${moduleChName}不存在`
      }

      if (_.isPlainObject(result) && result.flag === false) {
        return {
          statusCode: (result.status_code || 400),
          error: (result.error_msg || messages[result.error_code])
        }
      } else {
        return {
          result,
          error: null
        }
      }
    }
  })

  next()
}
