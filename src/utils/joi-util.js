import _ from 'lodash'
import Joi from 'joi'

export default Joi.extend([
  /**
   * @demo: Joi.string().in(['a', '1']).optional()
   */
    (Joi) => ({
    base: Joi.string(),
    name: 'string',
    language: {
      in: 'value must be one of {{in}}.'
    },
    rules: [
      {
        name: 'in',
        params: {
          in: Joi.array().items(Joi.string()).required()
        },
        validate(params, value, state, options) {
          if (!_.includes(params.in, value)) {
            return this.createError('string.in', {in: params.in}, state, options)
          }

          return value
        }
      }
    ]
  }),

  /**
   * @demo: Joi.string().splited_number(',').optional()
   */
    (Joi) => ({
    base: Joi.string(),
    name: 'string',
    language: {
      splited_number: 'value must be a splited with "{{sperator}}" number string.'
    },
    rules: [
      {
        name: 'splited_number',
        params: {
          sperator: Joi.string().required()
        },
        validate(params, value, state, options) {
          const array = value
            .split(params.sperator)
            .map(sub_val => _.toNumber(sub_val))

          return Joi.validate(array, Joi.array().items(Joi.number().integer()).required(), (err, value) => {
            if (!!err) {
              return _this.createError('string.splited_number', {sperator: params.sperator}, state, options)
            } else {
              return array
            }
          })
        }
      }
    ]
  }),

  /**
   * @demo: Joi.string().splited_integer(',').optional()
   */
    (Joi) => ({
    base: Joi.string(),
    name: 'string',
    language: {
      splited_integer: 'value must be a splited with "{{sperator}}" integer string.'
    },
    rules: [
      {
        name: 'splited_integer',
        params: {
          sperator: Joi.string().required()
        },
        validate(params, value, state, options) {
          const array = value
            .split(params.sperator)
            .map(sub_val => _.toNumber(sub_val))

          return Joi.validate(array, Joi.array().items(Joi.number()).required(), (err, value) => {
            if (!!err) {
              return this.createError('string.splited_integer', {sperator: params.sperator}, state, options)
            } else {
              return array
            }
          })
        }
      }
    ]
  }),

  /**
   * @demo: Joi.number().in([0.1, 1.2]).optional()
   */
    (Joi) => ({
    base: Joi.number(),
    name: 'number',
    language: {
      in: 'value must be one of {{in}}.'
    },
    rules: [
      {
        name: 'in',
        params: {
          in: Joi.array().items(Joi.number()).required()
        },
        validate(params, value, state, options) {
          params.in.map(val => _.toNumber(val))

          if (!_.includes(params.in, _.toNumber(value))) {
            return this.createError('number.in', {in: params.in}, state, options)
          }

          return value
        }
      }
    ]
  }),

  /**
   * @demo: Joi.number().integer().in([0, 1]).optional()
   */
    (Joi) => ({
    base: Joi.number().integer(),
    name: 'integer',
    language: {
      in: 'value must be one of {{in}}.'
    },
    rules: [
      {
        name: 'in',
        params: {
          in: Joi.array().items(Joi.number().integer()).required()
        },
        validate(params, value, state, options) {
          params.in.map(val => _.toNumber(val))

          if (!_.includes(params.in, _.toNumber(value))) {
            return this.createError('number.integer.in', {in: params.in}, state, options)
          }

          return value
        }
      }
    ]
  }),
])
