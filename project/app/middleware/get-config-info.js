const configurationModel = require(__path__models + 'configuration')


module.exports = async (req, res, next) => {
  await configurationModel.listConfigFrontend(null, null).then((data) => {
    res.locals.configInfo = data
  })
  next()
}