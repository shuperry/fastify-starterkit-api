import path from "path"

export default {
  name: 'fastify-starterkit-api[DEV]',
  log: {
    level: 'debug'
  },

  plugins: [
    'accepts',
    'jwt',
    'response-time',
    'formbody',
    'redis',
    'sequelize',
    'nodemailer',
    'compress',
    'favicon',
    'mongoose',
    'static',
    // 'knexjs'
  ],
  plugin: {
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
    },
    nodemailer: {
      sender: {
        // qq.
        // service: 'qq',
        // auth: {
        //   user: '576507045@qq.com',
        //   pass: 'xxx'
        // },

        // original smtp.
        host: 'xxx',
        port: 25,
        auth: {
          user: 'xxx',
          pass: 'xxx'
        },

        tls: {
          // do not fail on invalid certs.
          rejectUnauthorized: false
        }
      },
      options: {
        // qq.
        // from: '舒培培 <576507045@qq.com>',

        // original smtp.
        from: 'xxx'
      },
      retry: {
        enable: false,
        times: 3,
        interval: 50
      }
    },
    compress: {
      global: false
    },
    mongoose: {
      uri: 'mongodb://localhost:27017/myapp',
      autoIndex: false, // Don't build indexes.
      reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect.
      reconnectInterval: 500, // Reconnect every 500ms.
      poolSize: 10, // Maintain up to 10 socket connections.
      // If not connected, return errors immediately rather than waiting for reconnect.
      bufferMaxEntries: 0,
      connectTimeoutMS: 10000, // Give up initial connection after 10 seconds.
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity.
      family: 4 // Use IPv4, skip trying IPv6.
    },
    static: {
      root: path.join(__dirname, '..', 'static'),
      prefix: '/static/', // optional: default '/'.
    }
  },

  routers: {
    base_prefix: '/api',
    versions: [
      {
        enable: true,
        root_folder: 'v1',
        prefix: '/v1',
        logLevel: 'debug'
      }
    ]
  },

  middlewares: [
    'cors',
    'dns-prefetch-control',
    'frameguard',
    'hide-powered-by',
    'hsts',
    'ienoopen',
    'x-xss-protection'
  ],
  middleware: {
  },

  /**
   * 注: 如果 method 配置缺失, 则默认为此地址前缀的所有方法的请求都会被纳入检查范围内.
     e.g:
     '/api/v1/categories'

     or

     {
       path: '/api/v1/categories',
       method: 'get'
     }
   */
  auth: {
    /**
     * headers 中必须有正确并未失效的 authorization.
     */
    urls: [],
    pass_urls: [],

    /**
     * headers 中有或没有或有错误的 authorization, 请求的权限认证都会被忽略.
     */
    ignore_urls: [
      {
        path: '/api/v1/categories',
        method: 'get'
      }
    ]
  },

  page: {
    limit: 10
  },
  files: {
    maxUploadCount: 100
  },

  /**
   * 公用开关.
   *
   * @description 如果某项服务开关设置为 false, 在公用工具处此项服务不会生效, 并且会有警告日志.
   */
  switches: {
    plugin: {
      redis: false,
      sequelize: false,
      nodemailer: false
    },
    middleware: {

    }
  },
  sms: {
    lcss: {
      host: 'api.lingchuangyun.cn',
      url: '/send',
      params: {
        appid: '31262403f0135019',
        secret: '24f643a8ecd5db020bbd502d75f17776',
        genre: '4', // 发送短信类型id 1-验证码, 2-行业类, 3-营销类, 4-四大类
      }
    }
  }
}
