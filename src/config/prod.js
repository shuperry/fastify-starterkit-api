export default {
  name: 'fastify-starterkit-api',
  port: 7443,
  log: {
    level: 'debug'
  },
  upload_path: '/apps/crpower/attachments/fastify-starterkit-api',

  plugin: {
    redis: {
      key_prefix: 'fastify_starterkit_api_prod_',
      name: 'fastify-starterkit-api-redis-prod',
      host: '10.59.6.209',
      port: 6379,
      options: {
        connectionName: 'fastify-starterkit-api-redis-prod',
        family: '4',
        db: 1,
        password: '3bGp1IdpcvB1MjSpfBZj0Gdsjawj1uBt',
        showFriendlyErrorStack: true
      }
    },
    jwt: {
      secretKey: 'vMmYHnAppJGcQK1omzWx1Mt',
      options: {
        // expiresIn: '1d', // e.g: 1d, 1h, 5 (second)

        expiresIn: 5 // second.
      }
    },
    sequelize: {
      database: 'fastify-starterkit-api-prod',
      username: 'root',
      password: 'crP@ssw0rd',
      options: {
        host: '10.59.6.209',
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
