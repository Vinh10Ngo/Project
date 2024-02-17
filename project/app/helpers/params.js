

let getParams = (param, property, defaultValue) => {
  if(param.hasOwnProperty(property) && param[property] !== undefined) {
    return param[property]
  }
  return defaultValue
}
let createParams = (req) => {
  let params = {}
  params.keyword = getParams(req.query, 'keyword', '')

  params.currentStatus = getParams(req.params, 'status', 'all')
  
  params.sortField = getParams(req.session, 'sort_field', 'created.time')
  params.sortType = getParams(req.session, 'sort_type', 'desc')

  params.groupID = getParams(req.session, 'groups_id', 'allvalue')
  params.categoryID = getParams(req.session, 'category_id', 'allvalue')

 
  params.pagination = {
    totalItems: 1,
    totalItemsPerPage : 3,
    pageRanges: 3,
    currentPage : parseInt(getParams(req.query, 'page', 1)) 
  } 
  return params
}

module.exports = {
    getParams,
    createParams
}
