import _ from 'lodash'

// 为免文件过于庞大, 将 hook 拆分单独文件, 并按原顺序执行.
const hooksFileMap = {
  'onRequest': 'on-request',
  'preHandler': 'pre-handler',
  'onSend': 'on-send',
  'onResponse': 'on-response',
  'onRoute': 'on-route',
  'onClose': 'on-close'
}

export default (fastify) => {
  _.keys(hooksFileMap).forEach(hookName => {
    require(`../hooks/${hooksFileMap[hookName]}`)(fastify)
  })
}
