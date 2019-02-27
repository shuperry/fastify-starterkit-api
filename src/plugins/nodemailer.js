import MailUtil from '../utils/mail-util'

module.exports = async (fastify, opts, next) => {
  logger.info('loading nodemailer plugin with opts =', opts)

  fastify.decorate('nodemailer', new MailUtil(opts))

  next()
}
