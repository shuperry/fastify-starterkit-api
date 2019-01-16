export default {
  name: 'fastify-starterkit-api',
  port: 7443,
  log: {
    level: 'debug'
  },
  upload_path: '/apps/crpower/attachments/fastify-starterkit-api',

  middleware: {
  },
  plugin: {
    redis: {
      key_prefix: 'fastify_starterkit_api_prod_',
      name: 'fastify-starterkit-api-redis-prod',
      host: 'xxx',
      port: 6379,
      options: {
        connectionName: 'fastify-starterkit-api-redis-prod',
        family: '4',
        db: 1,
        password: 'xxx',
        showFriendlyErrorStack: true
      }
    },
    jwt: {
      secretKey: 'xxx',
      options: {
        // expiresIn: '1d', // e.g: 1d, 1h, 5 (second)

        expiresIn: 5 // second.
      }
    },
    sequelize: {
      database: 'fastify-starterkit-api-prod',
      username: 'xxx',
      password: 'xxx',
      options: {
        host: 'xxx',
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
  },

  auth: {
    urls: [
    ],
    pass_urls: [
    ]
  }
}
