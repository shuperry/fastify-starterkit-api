import crypto from 'crypto'

import _ from 'lodash'

class DesUtil {
  constructor(key, iv) {
    this.ALGORITHM = 'des-cbc'
    this.key = key
    this.iv = iv
  }

  encrypt(plainText) {
    const cipher = crypto.createCipheriv(this.ALGORITHM, this.key, this.iv)
    cipher.setAutoPadding(true)
    const ciph = cipher.update(_.toString(plainText), 'utf-8', 'hex')
    return ciph + cipher.final('hex')
  }

  decrypt(encryptedText) {
    const cipher = crypto.createDecipheriv(this.ALGORITHM, this.key, this.iv)
    cipher.setAutoPadding(true)
    const ciph = cipher.update(_.toString(encryptedText), 'hex', 'utf-8')
    return ciph + cipher.final('utf-8')
  }
}

export default DesUtil
