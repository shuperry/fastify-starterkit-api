import fp from 'fastify-plugin'

import Redis from 'ioredis'

import RedisUtil from '../utils/redis-util'

module.exports = fp((fastify, opts, next) => {
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
})

const testRedis = async (fastify) => {
  logger.debug(await fastify.redis.store({keyPrefix: 'case_', key: '1', objVal: {a: 'a', case_id: '1'}}))
  logger.debug(await fastify.redis.store({keyPrefix: 'case_', key: '2', objVal: {b: 'b', case_id: '2'}}))
  logger.debug(await fastify.redis.get({keyPrefix: 'case_', key: '2'}))
  logger.debug(await fastify.redis.multiGet({keyPrefix: 'case_', key: ['2', '3']}))
  logger.debug(await fastify.redis.del({keyPrefix: 'case_', key: '41415'}))

  // await fastify.redis.flushall()
}
