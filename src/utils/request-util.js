import _ from 'lodash'
import md5 from 'md5'
import Promise from 'bluebird'
import request from 'request'
import qs from 'querystring'

Promise.promisifyAll(request)

class RequestUtil {
  constructor() {

  }

  static async sendRequest({protocol = 'http:', host = '127.0.0.1', port, path, method = 'get', params = {}, multipart = false, headers = {}, queryString}) {
    let res

    if (protocol === 'http:') {
      port = port || 80
    } else if (protocol === 'https:') {
      port = port || 443
    }

    switch (method) {
      case 'post':
        if (multipart) {
          res = await request.postAsync({
            url: !!queryString ? `${protocol}//${host}:${port}${path}?${qs.stringify(queryString)}` :
              `${protocol}//${host}:${port}${path}`,
            formData: params,
            headers
          })
        } else {
          res = await request.postAsync({
            url: !!queryString ? `${protocol}//${host}:${port}${path}?${qs.stringify(queryString)}` :
              `${protocol}//${host}:${port}${path}`,
            body: params,
            headers,
            json: true
          })
        }

        break
      case 'patch':
        if (multipart) {
          res = await request.patchAsync({
            url: !!queryString ? `${protocol}//${host}:${port}${path}?${qs.stringify(queryString)}` :
              `${protocol}//${host}:${port}${path}`,
            formData: params,
            headers
          })
        } else {
          res = await request.patchAsync({
            url: !!queryString ? `${protocol}//${host}:${port}${path}?${qs.stringify(queryString)}` :
              `${protocol}//${host}:${port}${path}`,
            body: params,
            headers,
            json: true
          })
        }

        break
      case 'get':
        res = await request.getAsync({
          url: `${protocol}//${host}:${port}${path}`,
          qs: queryString,
          headers,
          json: true
        })
        break
    }

    logger.debug('visiting url => [', res.request.method, ']', res.request.uri.href, '\n data =>', params, '\n res = ', res)

    return res
  }

  static getSignature(params = {}, salt = '') {
    return md5(_.values(_.fromPairs(_.toPairs(params).sort())).join(':') + ':' + salt)
  }
}

export default RequestUtil
