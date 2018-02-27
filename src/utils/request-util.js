import Promise from 'bluebird'
import request from 'request'

Promise.promisifyAll(request)

export default async ({protocol = 'http', host = '127.0.0.1', port = 80, url, method = 'get', params = {}, multipart = false, headers = {}, queryString}) => {
  let res

  switch (method) {
    case 'post':
      if (multipart) {
        res = await request.postAsync({
          url: !!queryString ? `${protocol}://${host}:${port}${url}?${qs.stringify(queryString)}` :
            `${protocol}://${host}:${port}${url}`,
          formData: params,
          headers,
        })
      } else {
        res = await request.postAsync({
          url: !!queryString ? `${protocol}://${host}:${port}${url}?${qs.stringify(queryString)}` :
            `${protocol}://${host}:${port}${url}`,
          body: params,
          headers,
          json: true
        })
      }

      break
    case 'patch':
      if (multipart) {
        res = await request.patchAsync({
          url: !!queryString ? `${protocol}://${host}:${port}${url}?${qs.stringify(queryString)}` :
            `${protocol}://${host}:${port}${url}`,
          formData: params,
          headers,
        })
      } else {
        res = await request.patchAsync({
          url: !!queryString ? `${protocol}://${host}:${port}${url}?${qs.stringify(queryString)}` :
            `${protocol}://${host}:${port}${url}`,
          body: params,
          headers,
          json: true
        })
      }

      break
    case 'get':
      res = await request.getAsync({
        url: !!queryString ? `${protocol}://${host}:${port}${url}?${qs.stringify(queryString)}` :
          `${protocol}://${host}:${port}${url}`,
        qs: params,
        headers,
        json: true
      })
      break
  }

  logger.info('visiting url => [', res.request.method, ']', res.request.uri.href, '\n data =>', params, '\n res = ', '{', '\n  statusCode:', res.statusCode, '\n  statusMessage:', res.statusMessage, '\n  body:', res.body, '\n}')

  return res
}
