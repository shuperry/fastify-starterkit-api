export default {
  name: 'fastify-starterkit-api[DEV]',
  port: 8002,
  log: {
    level: 'debug'
  },
  upload_path: '/Users/perry/crpower-workspace/testUpload/',

  plugin: {
    redis: {
      key_prefix: 'fastify_starterkit_api_local_',
      name: 'fastify-starterkit-api-redis-local',
      host: '127.0.0.1',
      port: 6379,
      options: {
        connectionName: 'fastify-starterkit-api-redis-local',
        family: '4',
        db: 3,
        showFriendlyErrorStack: true,
        password: 'xxx'
      }
    },
    jwt: {
      secret_key: '2027EkgGJAti9B9iokygFVgsY',
      options: {
        expiresIn: '1d', // day.

        // expiresIn: 5 // second.
      }
    },
    sequelize: {
      database: 'fastify-starterkit-api',
      username: 'root',
      password: 'mysecretpassword',
      options: {
        host: '127.0.0.1',
        port: 3306,
        dialect: 'mysql',
        timezone: '+08:00',
        logging: console.log,
        pool: {
          max: 50,
          min: 15,
          idle: 10000
        }
      }
    }
  }
}
