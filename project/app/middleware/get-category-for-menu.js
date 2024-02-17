
const categoryModel = require(__path__models + 'category')
const utilsHelpers = require(__path__helpers + 'utils')

module.exports = async (req, res, next) => {
  await categoryModel.listItemsFrontend(null, {task: 'item-in-menu'}).then((items) => {
    res.locals.itemsCategory = items
  })
  res.locals.countArticlesInCategory = await utilsHelpers.countArticlesInCategory()
  next()
}