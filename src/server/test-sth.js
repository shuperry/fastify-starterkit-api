const testSendMail = async (fastify) => {
  const sendMailResult = await fastify.nodemailer.sendMail({
    receiver: ['576507045@qq.com'],
    subject: 'Test sending email by nodeJS',
    text: `Hello! This is a test email sent by nodeJS.`
  })
  logger.debug('sendMailResult =', sendMailResult)
}

const testRedis = async (fastify) => {
  logger.debug(await fastify.redis.store('case_', '1', {a: 'a', case_id: '1'}))
  logger.debug(await fastify.redis.store('case_', '2', {b: 'b', case_id: '2'}))
  logger.debug(await fastify.redis.get('case_', '2'))
  logger.debug(await fastify.redis.multiGet('case_', ['2', '3']))
  logger.debug(await fastify.redis.del('case_', '41415'))

  // await fastify.redis.flushdb()
}

export default async (fastify) => {
  // await testSendMail(fastify)

  // await testRedis(fastify)
}
