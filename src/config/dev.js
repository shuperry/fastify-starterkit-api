export default {
  name: 'fastify-starterkit-api[DEV]',
  port: 7443,
  log: {
    level: 'debug'
  },
  upload_path: '/apps/crpower/attachments/fastify-starterkit-api-dev',

  middleware: {
    cors: {
      origin: '*', // also support array, eg: ["http://example1.com", /\.example2\.com$/].
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
      preflightContinue: false,
      optionsSuccessStatus: 204
    }
  },

  plugin: {
    redis: {
      key_prefix: 'fastify_starterkit_api_dev_',
      name: 'fastify-starterkit-api-redis-dev',
      host: '10.59.6.209',
      port: 6379,
      options: {
        connectionName: 'fastify-starterkit-api-redis-dev',
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
      database: 'fastify-starterkit-api-dev',
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
    ],
    ignore_urls: [
      '/api/v1/categories'
    ]
  }
}
