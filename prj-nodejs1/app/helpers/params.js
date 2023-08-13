let getParams = (param, property, defaultValue) => {
  if(param.hasOwnProperty(property) && param[property] !== undefined) {
    return param[property]
  }
  return defaultValue
}
module.exports = {
    getParams 
}
