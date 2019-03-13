import fp from 'fastify-plugin'

import MailUtil from '../utils/mail-util'

module.exports = fp((fastify, opts, next) => {
  logger.info('loading nodemailer plugin with opts =', opts)

  fastify.decorate('nodemailer', new MailUtil(opts))

  next()
})
