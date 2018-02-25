export default {
  name: 'fastify-starterkit-api[DEV]',
  log: {
    level: 'debug'
  },
  routes: {
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
  middleware: {
  },
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
        //   pass: 'xxxxxx'
        // },

        // original smtp.
        host: 'smtp.crc.com.hk',
        port: 25,
        auth: {
          user: 'crp_mportal',
          pass: 'Run0102'
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
        from: '华润电力移动门户项目组 <crp_mportal@crpower.com.cn>'
      },
      retry: {
        enable: true,
        times: 3,
        interval: 50
      }
    },
    compress: {
      global: false
    }
  },
  page: {
    limit: 10
  },
  files: {
    maxUploadCount: 100
  }
}
