FROM node:9.10.0

MAINTAINER shuperry  cn.shperry@gmail.com

ENV HOME="/root"

COPY -r . ${HOME}/apps/fastify-starterkit-api

WORKDIR ${HOME}/apps/fastify-starterkit-api

RUN rm -rf node_modules

RUN npm i yarn pm2 pino -g

RUN yarn

EXPOSE 8888

CMD npm start
