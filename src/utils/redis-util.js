class RedisUtil {
  constructor(redisClient) {
    this.redisClient = redisClient
    this.app_key_prefix = config.get('plugin:redis:key_prefix')
  }

  async set(keyPrefix = '', key, objVal) {
    if (this.redisClient) {
      const res = await this.redisClient.set(this.app_key_prefix + keyPrefix + key, JSON.stringify(objVal))
      return res === 'OK' ? 'OK' : 'wrong'
    }
  }

  async store(keyPrefix = '', key, objVal) {
    if (this.redisClient) {
      const res = await this.redisClient.set(this.app_key_prefix + keyPrefix + key, JSON.stringify(objVal))
      return res === 'OK' ? 'OK' : 'wrong'
    }
  }

  async get(keyPrefix = '', key) {
    if (this.redisClient) {
      let res
      try {
        res = JSON.parse(await this.redisClient.get(this.app_key_prefix + keyPrefix + key))
      } catch (e) {
        res = await this.redisClient.get(this.app_key_prefix + keyPrefix + key)
      }
      return res
    }

    return null
  }

  async multiGet(keyPrefix = '', keys = []) {
    if (this.redisClient) {
      const multiGetArr = [], results = []

      if (_.isArray(keys)) {
        keys.forEach(key => multiGetArr.push([
          'get',
          this.app_key_prefix + keyPrefix + key
        ]))

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

  async del(keyPrefix = '', key) {
    if (this.redisClient) {
      const res = await this.redisClient.del(this.app_key_prefix + keyPrefix + key)
      return res === 0 ? 'OK' : 'wrong'
    }
  }

  async batchDel(keyPrefix = '', keys = []) {
    if (this.redisClient) {
      const multiDelArr = []

      if (_.isArray(keys)) {
        keys.forEach(key => multiDelArr.push([
          'del',
          this.app_key_prefix + keyPrefix + key
        ]))

        await this.redisClient.pipeline(multiDelArr).exec()
      }
    }
  }
}

export default RedisUtil
