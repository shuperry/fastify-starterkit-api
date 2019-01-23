import _ from 'lodash'
import RequestUtil from './request-util'

class LCSSSmsUtil {
  constructor() {

  }

  static async sendMail({mobiles = [], content = '谢谢。'}) {
    RequestUtil.sendRequest({
      host: config.get('sms:lcss:host'),
      url: config.get('sms:lcss:url'),
      method: 'post',
      params: _.merge(config.get('sms:lcss:params'), {mobile: mobiles.join(','), content})
    })
  }
}

export default LCSSSmsUtil
