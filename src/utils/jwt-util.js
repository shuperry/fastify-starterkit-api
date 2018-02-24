import _ from 'lodash'
import jwt from 'jsonwebtoken'

class JwtUtil {
  constructor(secret_key, options) {
    this.secret_key = secret_key
    this.options = options
  }

  sign(obj) {
    return jwt.sign(obj, this.secret_key, this.options)
  }

  verify(obj, opts) {
    return jwt.verify(obj, this.secret_key, _.extend({}, this.options, opts))
  }
}

export default JwtUtil
