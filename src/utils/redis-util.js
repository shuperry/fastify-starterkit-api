import _ from 'lodash'

class RedisUtil {
  constructor(redisClient) {
    this.redisClient = redisClient
    this.app_key_prefix = config.get('plugin:redis:key_prefix')
  }

  async set(keyPrefix = '', key, objVal) {
    if (config.get('switches:redis') === false) {
      logger.warn('redis 服务已被关闭, 如要使用此服务, 需开启 switches:nodemailer 开关.')
    } else if (this.redisClient) {
      const res = await this.redisClient.set(this.app_key_prefix + keyPrefix + _.toString(key), JSON.stringify(objVal))
      return res === 'OK' ? 'OK' : 'wrong'
    }
  }

  async store(keyPrefix = '', key, objVal) {
    if (config.get('switches:redis') === false) {
      logger.warn('redis 服务已被关闭, 如要使用此服务, 需开启 switches:nodemailer 开关.')
    } else if (this.redisClient) {
      const res = await this.redisClient.set(this.app_key_prefix + keyPrefix + _.toString(key), JSON.stringify(objVal))
      return res === 'OK' ? 'OK' : 'wrong'
    }
  }

  async get(keyPrefix = '', key) {
    if (this.redisClient) {
      let res
      try {
        res = JSON.parse(await this.redisClient.get(this.app_key_prefix + keyPrefix + _.toString(key)))
      } catch (e) {
        res = await this.redisClient.get(this.app_key_prefix + keyPrefix + _.toString(key))
      }
      return res
    }

    return null
  }

  async multiGet(keyPrefix = '', keys = []) {
    if (config.get('switches:redis') === false) {
      logger.warn('redis 服务已被关闭, 如要使用此服务, 需开启 switches:nodemailer 开关.')
    } else if (this.redisClient) {
      const multiGetArr = [], results = []

      if (_.isArray(keys)) {
        keys.forEach(key => multiGetArr.push([
          'get',
          this.app_key_prefix + keyPrefix + _.toString(key)
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
    if (config.get('switches:redis') === false) {
      logger.warn('redis 服务已被关闭, 如要使用此服务, 需开启 switches:nodemailer 开关.')
    } else if (this.redisClient) {
      const res = await this.redisClient.del(this.app_key_prefix + keyPrefix + _.toString(key))
      return res === 0 ? 'OK' : 'wrong'
    }
  }

  async batchDel(keyPrefix = '', keys = []) {
    if (config.get('switches:redis') === false) {
      logger.warn('redis 服务已被关闭, 如要使用此服务, 需开启 switches:nodemailer 开关.')
    } else if (this.redisClient) {
      const multiDelArr = []

      if (_.isArray(keys)) {
        keys.forEach(key => multiDelArr.push([
          'del',
          this.app_key_prefix + keyPrefix + _.toString(key)
        ]))

        await this.redisClient.pipeline(multiDelArr).exec()
      }
    }
  }

  async flushdb() {
    if (config.get('switches:redis') === false) {
      logger.warn('redis 服务已被关闭, 如要使用此服务, 需开启 switches:nodemailer 开关.')
    } else if (this.redisClient) {
      await this.redisClient.flushdb()
    }
  }
}

export default RedisUtil
