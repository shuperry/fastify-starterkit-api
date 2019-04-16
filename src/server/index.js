import fs from 'fs'

import _ from 'lodash'
import ip from 'ip'
import base64Img from 'base64-img'
import xlsx from 'node-xlsx'
import S from 'string'

import loadMiddlewares from './load-middlewares'
import loadHooks from './load-hooks'
import loadPlugins from './load-plugins'
import loadRouters from './load-routers'
import testSth from './test-sth'

import config from '../config'

global.config = config

const logger = require('pino')(config.get('log'))
global.logger = logger

const fastify = require('fastify')({
  logger,
  // https: {
  //   allowHTTP1: true
  //   key: fs.readFileSync(path.join(__dirname, '../test/https/fastify.key')),
  //   cert: fs.readFileSync(path.join(__dirname, '../test/https/fastify.cert'))
  // }
})

fastify.addContentTypeParser('multipart/form-data', async (request, next) => {
  // 添加此步骤会导致表单请求进入两次 preHandler hook 的问题.
  // next()
})

fastify.setErrorHandler((err, request, reply) => {
  logger.error(err.stack)
  reply.status(500).send({
    error: err.stack
  })
})

if (config.get('switches:loadPlugins') !== false) { // 配置了开关为 false 才不加载.
  loadPlugins(fastify)
}

/**
 * 配置了开关为 false 才不加载.
 * hooks 与 middlewares 本身为 router 服务, 如果不加载 router, 则 hook 没有加载的必要.
 */
if (config.get('switches:loadRouters') !== false) {
  loadHooks(fastify)
  loadMiddlewares(fastify)
  loadRouters(fastify)
}

global.fastify = fastify

const port = config.get('port')

fastify.listen(port, '0.0.0.0', async (err) => {
  if (err) {
    logger.error(err)
    return
  }

  const xlsdata = xlsx.parse(`/Users/shupeipei/Downloads/c6c4babfceff5594.xlsx`)
  // logger.info('excel data =', xlsdata)

  let buildData = [], buildRowData = [], rowData = [], rowStr = ''
  _.each(xlsdata[0]['data'], (v, i) => {
    if (i > 0) {
      logger.info('v =', _.toString(v).split(','))

      rowData = _.toString(v).split(',')

      buildRowData = []
      buildRowData.push(rowData[1]) // 姓名
      buildRowData.push(rowData[2]) // 电话号码
      buildRowData.push(rowData[3]) // 省
      buildRowData.push(rowData[4]) // 市
      buildRowData.push(rowData[5]) // 区

      // 详细地址
      rowStr = S(rowData[6])
        .replaceAll(' ', '')
        .replaceAll('深圳市', '')
        .replaceAll('深圳市南山区', '')
        .replaceAll('深圳南山区', '')
        .replaceAll('南山区', '')
        .replaceAll('深圳市福田区', '')
        .replaceAll('福田区', '')
        .s
      if (rowStr.indexOf('/') > -1) {
        buildRowData.push(
          S(rowStr).substr(0, rowStr.indexOf('/')).s
        )
      } else {
        buildRowData.push(S(rowStr).s)
      }

      buildRowData.push(`购买平台：${rowData[9]}, 商品：${rowData[8]}`)

      buildData.push(buildRowData)
    }
  })

  fs.writeFileSync('/Users/shupeipei/Downloads/test1.xlsx', xlsx.build([{name: "mySheetName", data: buildData}]), {'flag': 'w'})

  // const newImgBse64Str = await base64Img.base64Sync('/Users/shupeipei/Desktop/me.jpeg')
  // logger.info('imgBse64Str new icon = ', newImgBse64Str)

  fastify.swagger()

  logger.info(`You can also visit server at http://${ip.address()}:${port}`)

  // const query = {timestamp: 1550107261022, access_token: 'ajuhgtgyagtgrtrhytjtuyju', tad: 'aaa', identity: '42032519890304111X'}
  //
  // logger.info('topairs =', _.toPairs(query))
  // logger.info('sorted topairs =', _.toPairs(query).sort())
  // logger.info('frompairs =', _.fromPairs(_.toPairs(query).sort()))
  // logger.info('values of frompairs =', _.values(_.fromPairs(_.toPairs(query).sort())))
  // logger.info('str of frompairs values =', _.values(_.fromPairs(_.toPairs(query).sort())).join(':'))

  // await testSth(fastify)
})
