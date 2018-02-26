import fs from 'fs'
import path from 'path'

import _ from 'lodash'
import multer from 'multer'

import categoryService from '../../services/category-service'

const moduleChName = '通用类别'

const upload = multer({dest: config.get('upload_path')})

export default (fastify, opts, next) => {
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
    beforeHandler(request, reply, done) { // 此函数只支持同步, 否则会出现提前进入 handler 函数的问题.
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

        done()
      })
    },
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
      },
      handler: async (request, reply) => {
        reply
        // .type('text/plain')
          .compress(fs.createReadStream(path.join(config.get('appPath'), 'package.json')))
      }
    }
  })

  fastify.get('/categories', {
    schema: {
      querystring: {
        type: 'object',
        properties: {
          name: {
            type: 'string'
          }
        },
        // required: ['name']
      }
    },
    beforeHandler(request, reply, done) {
      logger.info('into get categories route beforeHandler hook')

      done()
    },
    handler: async (request, reply) => {
      const messages = {
        notExists: `${moduleChName}不存在`
      }

      // const sendMailResult = await fastify.nodemailer.sendMail({
      //   receiver: ['576507045@qq.com'],
      //   subject: 'Test sending email with nodeJS',
      //   text: 'Hello! This is a test email sent with nodeJS.'
      // })
      // logger.info('sendMailResult =', sendMailResult)

      const result = await categoryService.getCategories(fastify, _.extend({}, request.params || {}, request.query || {}))

      if (_.isPlainObject(result) && result.flag === false) {
        return {
          status: (result.status_code || 400),
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
          name: {
            type: 'string'
          },
          rank: {
            type: 'string'
          },
          parent_id: {
            type: 'integer'
          }
        }
      }
    },
    handler: async (request, reply) => {
      const category = await categoryService.createCategory(fastify, request.body)

      return {
        result: category,
        error: null
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
      const params = _.merge({}, request.params, request.body)

      const category = await categoryService.updateCategory(fastify, params)

      return {
        result: category,
        error: null
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
      const params = _.merge({}, request.params)

      const category = await categoryService.getCategoryById(fastify, params)

      return {
        result: category,
        error: null
      }
    }
  })

  next()
}
