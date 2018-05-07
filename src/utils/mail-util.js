import _ from 'lodash'
import async from 'async'
import Promise from 'bluebird'
import emailValidator from 'email-address'
import nodemailer from 'nodemailer'

Promise.promisifyAll(async)

class MailUtil {
  constructor(opts) {
    this.opts = opts
    this.transporter = nodemailer.createTransport(opts.sender)
  }

  /**
   * 发送邮件.
   *
   * @param receiver<String/Array> 收件人 (支持字符串和字符串数组格式).
   * @param subject 主题.
   * @param text 文本格式邮件内容.
   * @param html 网页格式邮件内容, 一般 html 与 text 不同时传, 如果同时存在默认使用 html.
   * @param attachments 附件, 参考 api: https://nodemailer.com/message/attachments/.
   *
   * @returnParam successful 邮件发送成功的邮件地址.
   * @returnParam failed 邮件发送失败的邮件地址.
   * @returnParam wrong 格式不正确的邮件地址.
   */
  async sendMail({receiver, subject, text, html, attachments}) {
    if (config.get('switches:nodemailer') === false) {
      logger.warn('nodemailer 邮件服务未开启, 如要使用此服务, 需开启 switches:nodemailer 开关.')

      return {
        rejected: receiver
      }
    }

    const seriesJobs = []
    const successful = [], failed = [], wrong = []

    const sendMailCoreFunc = async (receiver, retryCallback) => {
      try {
        await this.transporter.sendMail({
          ...this.opts.options,
          to: receiver,
          subject,
          text: !!html ? '' : text,
          html,
          attachments
        })

        logger.info('邮件发送成功 receiver =', receiver)

        successful.push(receiver)

        if (_.isFunction(retryCallback)) retryCallback(null)
      } catch (err) {
        logger.error('邮件发送失败 receiver =', receiver, 'err =', err)

        if (_.isFunction(retryCallback)) retryCallback('failed.')
      }
    }

    const generageSeriesJobs = (receiver) => {
      if (this.opts.retry.enable) {
        seriesJobs.push(async (seriesCallback) => {
          await async.retryAsync({
            times: this.opts.retry.times,
            interval: this.opts.retry.interval,
            errorFilter: (err) => {
              return !!err
            }
          }, async (retryCallback) => {
            await sendMailCoreFunc(receiver, retryCallback)
          }, (err) => {
            if (!!err) { // final failed after retry.
              failed.push(receiver)
            }

            if (_.isFunction(seriesCallback)) seriesCallback(null, receiver)
          })
        })
      } else {
        seriesJobs.push(async () => {
          await sendMailCoreFunc(receiver)
        })
      }
    }

    if (_.isArray(receiver)) {
      let filteredReceivers = []
      receiver.forEach(receiverItem => {
        if (!emailValidator.isValid(receiverItem)) {
          wrong.push(receiverItem)
        } else {
          filteredReceivers.push(receiverItem)
        }
      })

      filteredReceivers = _.uniq(filteredReceivers)

      if (filteredReceivers.length > 0) {
        generageSeriesJobs(filteredReceivers)
      }
    } else if (_.isString(receiver)) {
      if (!emailValidator.isValid(receiver)) {
        wrong.push(receiver)
        return
      } else {
        generageSeriesJobs(receiver)
      }
    }

    if (seriesJobs.length > 0) await async.seriesAsync(seriesJobs)

    return {
      successful,
      failed,
      wrong
    }
  }
}

export default MailUtil
