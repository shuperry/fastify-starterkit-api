import _ from 'lodash'
import Joi from 'joi'

export default Joi.extend([
  (Joi) => ({
    base: Joi.number(),
    name: 'number',
    language: {
      map: 'value must be one of {{map}}.'
    },
    rules: [
      {
        name: 'map',
        params: {
          map: Joi.array().required()
        },
        validate(params, value, state, options) {
          params.map.map(val => _.toNumber(val))

          if (!_.includes(params.map, _.toNumber(value))) {
            return this.createError('number.map', {map: params.map}, state, options)
          }

          return value
        }
      }
    ]
  }),

  (Joi) => ({
    base: Joi.string(),
    name: 'string',
    language: {
      map: 'value must be one of {{map}}.'
    },
    rules: [
      {
        name: 'map',
        params: {
          map: Joi.array().items(Joi.string()).required()
        },
        validate(params, value, state, options) {
          if (!_.includes(params.map, value)) {
            return this.createError('string.map', {map: params.map}, state, options)
          }

          return value
        }
      }
    ]
  })
])
