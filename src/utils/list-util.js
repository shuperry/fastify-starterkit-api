class ListUtil {
  constructor() {

  }

  static list2Tree({data = [], rootId, idFieldName = 'id', parentIdFielName = 'parentId'}) {
    var r = [], o = {}
    data.forEach(function (a) {
      if (o[a[idFieldName]] && o[a[idFieldName]].children) {
        a.children = o[a[idFieldName]] && o[a[idFieldName]].children
      }
      o[a[idFieldName]] = a
      if (a[parentIdFielName] === rootId) {
        r.push(a)
      } else {
        o[a[parentIdFielName]] = o[a[parentIdFielName]] || {}
        o[a[parentIdFielName]].children = o[a[parentIdFielName]].children || []
        o[a[parentIdFielName]].children.push(a)
      }
    })

    return r
  }
}

export default ListUtil
