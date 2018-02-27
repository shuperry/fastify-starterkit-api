import fp from 'fastify-plugin'
import Redis from 'ioredis'

import RedisUtil from '../utils/redis-util'

const fastifyPlugin = (fastify, opts, next) => {
  logger.info('loading redis plugin with opts =', opts)

  let client = null,
      redisUtil = null

  try {
    client = new Redis(opts.port, opts.host, opts.options)
    redisUtil = new RedisUtil(client)
  } catch (err) {
    return next(err)
  }

  fastify.decorate('redis', redisUtil)

  next()
}

async function __test() {
  logger.debug(await fastify.redis.store('category_', '1', {a: 'a', case_id: '1'}))
  logger.debug(await fastify.redis.store('category_', '2', {b: 'b', case_id: '2'}))
  logger.debug(await fastify.redis.get('category_', '2'))
  logger.debug(await fastify.redis.multiGet('category_', ['2', '3']))
  logger.debug(await fastify.redis.del('category_', '41415'))
}

module.exports = fp(fastifyPlugin, {
  fastify: '>=0.39',
  name: 'fastify-redis'
})
