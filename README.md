## Backend as a service(BaaS) platform.

## Features

* **[fastify](https://www.npmjs.com/package/fastify)**
* **[es6](http://es6.ruanyifeng.com)**
* **[nconf](https://www.npmjs.com/package/nconf)**
* **[pino](https://www.npmjs.com/package/pino)**
* **[sequelize](http://docs.sequelizejs.com)**
* **[sequelize-hierarchy](https://www.npmjs.com/package/sequelize-hierarchy)**
* **[pm2](http://pm2.keymetrics.io/docs/usage/quick-start)**
* **[multer](https://www.npmjs.com/package/multer)**
* **[async / await](http://www.ruanyifeng.com/blog/2015/05/async.html)**
* **[decorator](https://medium.com/google-developers/exploring-es7-decorators-76ecb65fb841)**

## Quick start

1. Clone this repo using `git clone https://github.com/shuperry/fastify-starterkit-api.git`.
2. Run `npm install` or `yarn` to install dependencies.
3. Run `npm i pm2 pino pino-pretty -g` to install global dependencies.
4. Run `npm start` to start service in local development mode.
5. Run `pm2 logs --raw fastify-starterkit-api-local | pino-pretty -c -f` to see logs in local development mode.

## Configuration

We use [nconf](https://www.npmjs.com/package/nconf) to manage configuration between different environment, the configuration of current environment file name is just the same as environment, and it is extend with `src/config/default.js`. 

## Environments

### production mode

1. Start core serice script: `npm run prod_cluster`.

> Execute start service script except local env need install pm2 globally: `npm install pm2 pino -g`.

### development mode

* **startup services:**

1. Start core serice script: `npm run dev`.

* **show log scripts:**

```bash
pm2 logs --raw fastify-starterkit-api-dev | pino -L
```
