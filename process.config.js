module.exports = {
  apps: [
    {
      name: 'fastify-starterkit-api-local',
      env: {
        NODE_ENV: 'local',
        DEBUG: 'tip'
      },
      script: './bin/index.js',
      watch: [
        'src'
      ],
      ignore_watch: [
        'node_modules'
      ],
      log_file: './logs/local/fastify-starterkit-api.log'
    },
    {
      name: 'fastify-starterkit-api-dev',
      env: {
        NODE_ENV: 'dev',
        DEBUG: 'tip'
      },
      script: './bin/index.js',
      watch: [
        'src'
      ],
      ignore_watch: [
        'node_modules'
      ],
      log_file: './logs/dev/fastify-starterkit-api.log'
    },
    {
      name: 'fastify-starterkit-api',
      env: {
        NODE_ENV: 'prod',
        DEBUG: 'tip'
      },
      script: './bin/index.js',
      watch: [
        'src'
      ],
      ignore_watch: [
        'node_modules'
      ],
      log_file: './logs/prod/fastify-starterkit-api.log'
    },
    {
      name: 'fastify-starterkit-api-cluster',
      env: {
        NODE_ENV: 'prod',
        DEBUG: 'tip'
      },
      script: './bin/index.js',
      watch: [
        'src'
      ],
      ignore_watch: [
        'node_modules'
      ],
      log_file: './logs/prod/fastify-starterkit-api-cluster.log',
      instances: 4,
      exec_mode: 'cluster'
    }
  ]
}
