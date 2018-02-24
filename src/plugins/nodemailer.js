import fp from 'fastify-plugin'

import MailUtil from '../utils/mail-util'

const fastifyPlugin = async (fastify, opts, next) => {
  fastify.decorate('nodemailer', new MailUtil(opts))

  next()
}

module.exports = fp(fastifyPlugin, {
  fastify: '>=0.39',
  name: 'fastify-nodemailer'
})
