import _ from 'lodash'

class BaseHelper {
  constructor() {

  }

  generateConditionForKeyText({attributes = [], keyText}) {
    const or = []
    let condition
    attributes.forEach(attribute => {
      condition = {}
      condition[attribute] = {$like: `%${keyText}%`}
      or.push(condition)
    })

    return or
  }

  generateConditionForFuzzyLike(params = []) {
    const condition = {}

    _.keys(params).forEach(key => {

    })
  }

  generateConditionForEqual(params = []) {
    const condition = {}

    _.keys(params).forEach(key => {

    })
  }
}

export default BaseHelper
