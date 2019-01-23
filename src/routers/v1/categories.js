import fs from 'fs'
import path from 'path'

import _ from 'lodash'
import multer from 'multer'

import categoryService from '../../services/category-service'

import Joi from '../../utils/joi-util'
import requestUtil from '../../utils/request-util'
import RouterUtil from '../../utils/router-util'

const upload = multer({dest: config.get('upload_path')})

const moduleCNName = '通用类别'

const errMessages = {
  notExists: `${moduleCNName}不存在`,
  parentNotExists: `上级${moduleCNName}不存在`
}

export default (fastify, opts, next) => {
  fastify.get('/test-request', {
    schema: {
      querystring: Joi.object({
      })
    },
    schemaCompiler: schema => data => Joi.validate(data, schema, { allowUnknown: true }),
    handler: async (request, reply) => {
      await requestUtil.sendRequest({
        // host: '119.27.184.157',
        port: 8911,
        url: '/mail/send',
        method: 'post',
        multipart: true,
        params: {
          attachments: [
            fs.createReadStream('/Users/shupeipei/DeskTop/test1.xlsx'),
            fs.createReadStream('/Users/shupeipei/DeskTop/test2.xlsx'),
            // more file.
          ],
          to: '576507045@qq.com; cn.shshupeipei@gmail.com',
          subject: '测试sendCloud发送邮件',
          html: '你好:<br/>&nbsp;&nbsp;&nbsp;&nbsp;这是用sendCloud发送的邮件。',
        }
      })

      return reply.send({
        flag: 'success'
      })
    }
  })

  fastify.post('/files', {
    beforeHandler: [ // beforeHandler 函数只支持同步, 否则会出现提前进入 handler 函数的问题.
      (request, reply, next) => { // 上传文件.
        upload.fields([
          { name: 'files' },
          { name: 'files2' }
        ])(fastify.server.req, fastify.server.res, err => {
          if (err) {
            reply.code(400).send(err)
          }

          next()
        })
      },
      (request, reply, next) => { // 处理及验证 multipart/form-data 表单参数.
        RouterUtil.dealSpecialMultipartFormdataRouterParam(fastify)

        const schema = Joi.object({
          title: Joi.string().required(),
          body: Joi.object({
            item1: Joi.string().required()
          }).required(),
          files: Joi.object({
            files: Joi.array().min(1).max(config.get('files:maxUploadCount')).optional(),
            files2: Joi.array().min(1).max(config.get('files:maxUploadCount')).optional()
          })
        })

        Joi.validate(fastify.server.req.body, schema, { allowUnknown: false }, (err) => {
          if (err) {
            reply.code(400).send(err)
          }

          next()
        })
      }
    ],
    handler: async (request, reply) => {
      console.log('into upload file done with fastify.server.req.files =', JSON.stringify(fastify.server.req.files))
      console.log('into upload file done with fastify.server.req.body =', fastify.server.req.body)

      return reply.send({
        flag: 'success'
      })
    }
  })

  fastify.get('/download-files', {
    schema: {
      querystring: Joi.object({
        name: Joi.string().optional()
      })
    },
    schemaCompiler: schema => data => Joi.validate(data, schema, { allowUnknown: false }),
    handler: async (request, reply) => {
      reply
        .type('application/octet-stream')
        .headers({
          'content-disposition': `attachment; filename="${encodeURI('测试中文package.json')}"`
        })
        .compress(fs.createReadStream(path.join(config.get('appPath'), 'package.json')))
    }
  })

  fastify.get('/meetings', {
    schema: {
      querystring: Joi.object({
        keyText: Joi.string().optional(),
        meeting_member_sid: Joi.string().optional(),
        wechat_dept_id: Joi.string().splited_integer('|').optional(),
        name: Joi.string().optional(),
        place: Joi.string().optional(),
        description: Joi.string().optional(),
        remark: Joi.string().optional(),

        start_begin_time: Joi.date().timestamp().optional(),
        end_begin_time: Joi.date().timestamp().optional(),

        start_finish_time: Joi.date().timestamp().optional(),
        end_finish_time: Joi.date().timestamp().optional(),

        created_by: Joi.string().optional(),
        updted_by: Joi.string().optional(),

        start_created_at: Joi.date().timestamp().optional(),
        end_created_at: Joi.date().timestamp().optional(),

        start_updated_at: Joi.date().timestamp().optional(),
        end_updated_at: Joi.date().timestamp().optional(),

        enabled: Joi.number().integer().in([0, 1]).optional(),

        offset: Joi.number().integer().greater(0).optional(),
        limit: Joi.number().integer().greater(0).optional(),

        needPage: Joi.string().in(['true', 'false']).optional()
      })
    },
    schemaCompiler: schema => data => Joi.validate(data, schema, { allowUnknown: true }),
    handler: async (request, reply) => {
      const params = _.extend({}, request.params || {}, request.query || {})

      const result = await categoryService.getMeetings(fastify, params)

      if (_.isPlainObject(result) && result.flag === false) {
        reply.code(400).send(new Error(result.error_msg || errMessages[result.error_code]))
      } else {
        reply.send({
          result
        })
      }
    }
  })

  fastify.get('/categories', {
    schema: {
      querystring: Joi.object({
        keyText: Joi.string().optional(),
        name: Joi.string().optional(),
        code: Joi.string().optional(),
        parent_id: Joi.number().integer().optional(),
        category_id: Joi.number().integer().optional()
      })
    },
    schemaCompiler: schema => data => Joi.validate(data, schema, { allowUnknown: false }),
    beforeHandler(request, reply, next) {
      logger.info('into get categories route beforeHandler hook')

      next()
    },
    handler: async (request, reply) => {
      const params = _.extend({}, request.params || {}, request.query || {})

      const result = await categoryService.getCategories(fastify, params)

      if (_.isPlainObject(result) && result.flag === false) {
        reply.code(400).send(new Error(result.error_msg || errMessages[result.error_code]))
      } else {
        reply.send({
          result
        })
      }
    }
  })

  fastify.post('/categories', {
    schema: {
      body: Joi.object({
        name: Joi.string().required(),
        code: Joi.string().allow('').optional(),
        rank: Joi.number().optional(),
        parent_id: Joi.number().integer().optional()
      })
    },
    schemaCompiler: schema => data => Joi.validate(data, schema, { allowUnknown: false }),
    handler: async (request, reply) => {
      const params = _.extend({}, request.body || {})

      const result = await categoryService.createCategory(fastify, params)

      if (_.isPlainObject(result) && result.flag === false) {
        reply.code(400).send(new Error(result.error_msg || errMessages[result.error_code]))
      } else {
        reply.send({
          result
        })
      }
    }
  })

  fastify.patch('/categories/:category_id', {
    schema: {
      params: Joi.object({
        category_id: Joi.number().integer().required()
      }),
      body: Joi.object({
        name: Joi.string().optional(),
        code: Joi.string().allow('').optional(),
        rank: Joi.number().optional(),
        parent_id: Joi.number().integer().optional()
      })
    },
    schemaCompiler: schema => data => Joi.validate(data, schema, { allowUnknown: false }),
    handler: async (request, reply) => {
      const params = _.extend({}, request.params || {}, request.body || {})

      const result = await categoryService.updateCategory(fastify, params)

      if (_.isPlainObject(result) && result.flag === false) {
        reply.code(400).send(new Error(result.error_msg || errMessages[result.error_code]))
      } else {
        reply.send({
          result
        })
      }
    }
  })

  fastify.get('/categories/:category_id', {
    schema: {
      params: Joi.object({
        category_id: Joi.number().integer().required()
      })
    },
    schemaCompiler: schema => data => Joi.validate(data, schema, { allowUnknown: false }),
    handler: async (request, reply) => {
      const params = _.extend({}, request.params || {})

      const result = await categoryService.getCategoryById(fastify, params)

      if (_.isPlainObject(result) && result.flag === false) {
        reply.code(400).send(new Error(result.error_msg || errMessages[result.error_code]))
      } else {
        reply.send({
          result
        })
      }
    }
  })

  next()
}
