import path from 'path'

import _ from 'lodash'
import cls from 'continuation-local-storage'
import fp from 'fastify-plugin'
import fsPlus from 'fs-plus'
import hierachy from 'sequelize-hierarchy'

const namespace = cls.createNamespace('g_api_cls')

const Sequelize = hierachy(require('sequelize'))
Sequelize.useCLS(namespace)

const Op = Sequelize.Op
const operatorsAliases = {
  $eq: Op.eq,
  $ne: Op.ne,
  $gte: Op.gte,
  $gt: Op.gt,
  $lte: Op.lte,
  $lt: Op.lt,
  $not: Op.not,
  $in: Op.in,
  $notIn: Op.notIn,
  $is: Op.is,
  $like: Op.like,
  $notLike: Op.notLike,
  $iLike: Op.iLike,
  $notILike: Op.notILike,
  $regexp: Op.regexp,
  $notRegexp: Op.notRegexp,
  $iRegexp: Op.iRegexp,
  $notIRegexp: Op.notIRegexp,
  $between: Op.between,
  $notBetween: Op.notBetween,
  $overlap: Op.overlap,
  $contains: Op.contains,
  $contained: Op.contained,
  $adjacent: Op.adjacent,
  $strictLeft: Op.strictLeft,
  $strictRight: Op.strictRight,
  $noExtendRight: Op.noExtendRight,
  $noExtendLeft: Op.noExtendLeft,
  $and: Op.and,
  $or: Op.or,
  $any: Op.any,
  $all: Op.all,
  $values: Op.values,
  $col: Op.col
}

module.exports = fp(async (fastify, opts, next) => {
  logger.info('loading sequelize plugin with opts =', opts)

  const sequelize = new Sequelize(opts.database, opts.username, opts.password, _.extend(opts.options, {operatorsAliases}))
  const modelPath = path.join(config.get('appPath'), 'src', 'models')

  fsPlus.listTreeSync(modelPath)
    .reduce((prev, current) => prev.concat(current), [])
    .filter(filePath => fsPlus.isFileSync(filePath) && path.extname(filePath) === '.js')
    .forEach(filePath => {
      logger.info(`importing model: ${filePath.substring(modelPath.length, filePath.length - 3)}`)
      sequelize.import(filePath)
    })

  _.values(sequelize.models)
    .filter(model => _.isFunction(model.associate))
    .forEach(model => {
      logger.info(`executing associate function in model: ${model.name}`)
      model.associate(sequelize.models)
    })

  // rebuild hierarchy data for Object and Category model.
  // await sequelize.models.Category.rebuildHierarchy()

  // 初始化不存在的数据库表.
  await sequelize.sync()

  fastify.decorate('sequelize', sequelize)

  global.sequelize = sequelize

  next()
})
