import _ from 'lodash'

class RedisUtil {
  constructor(redisClient) {
    this.redisClient = redisClient
    this.app_key_prefix = config.get('plugin:redis:key_prefix')
  }

  async set({keyPrefix = '', key, objVal}) {
    if (this.redisClient) {
      const storedKey = this.app_key_prefix + keyPrefix + _.toString(key)
      const res = await this.redisClient.set(storedKey, JSON.stringify(objVal))

      logger.info('storing to redis with key =', storedKey, 'data =', JSON.stringify(objVal))

      return res === 'OK' ? 'OK' : 'wrong'
    }
  }

  async store({keyPrefix = '', key, objVal}) {
    if (this.redisClient) {
      return await this.set({keyPrefix, key, objVal})
    }
  }

  async get({keyPrefix = '', key}) {
    if (this.redisClient) {
      const storedKey = this.app_key_prefix + keyPrefix + _.toString(key)
      let res
      try {
        res = JSON.parse(await this.redisClient.get(storedKey))
      } catch (e) {
        res = await this.redisClient.get(storedKey)
      }

      logger.info('getting from redis with key =', storedKey, ' res =', res)

      return res
    }

    return null
  }

  async multiGet({keyPrefix = '', keys = []}) {
    if (this.redisClient) {
      const multiGetArr = [], results = []
      let storedKey

      if (_.isArray(keys)) {
        keys.forEach(key => {
          storedKey = this.app_key_prefix + keyPrefix + _.toString(key)
          multiGetArr.push([
            'get',
            this.app_key_prefix + keyPrefix + _.toString(key)
          ])

          logger.info('before deleting from redis with key =', storedKey)

        })

        const vals = await this.redisClient.pipeline(multiGetArr).exec()
        vals.forEach(valArr => {
          try {
            results.push(JSON.parse(valArr[1]))
          } catch (e) {
            results.push(valArr[1])
          }
        })
      }

      return results
    }

    return null
  }

  async del({keyPrefix = '', key}) {
    if (this.redisClient) {
      const storedKey = this.app_key_prefix + keyPrefix + _.toString(key)
      const res = await this.redisClient.del(storedKey)

      logger.info('deleting from redis with key =', storedKey)

      return res === 0 ? 'OK' : 'wrong'
    }
  }

  async batchDel({keyPrefix = '', keys = []}) {
    if (this.redisClient) {
      const multiDelArr = []
      let storedKey

      if (_.isArray(keys)) {
        keys.forEach(key => {
          storedKey = this.app_key_prefix + keyPrefix + _.toString(key)
          multiDelArr.push([
            'del',
            storedKey
          ])

          logger.info('before deleting from redis with key =', storedKey)
        })

        await this.redisClient.pipeline(multiDelArr).exec()
      }
    }
  }

  getInstance() {
    return this.redisClient
  }

  async flushdb() {
    if (this.redisClient) {
      await this.redisClient.flushdb()
    }
  }

  async flushall() {
    if (this.redisClient) {
      await this.redisClient.flushall()
    }
  }
}

export default RedisUtil
