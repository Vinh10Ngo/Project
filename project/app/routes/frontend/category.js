var express = require('express');
var router = express.Router();

const articleModel = require(__path__models + 'article')
const utilsHelpers = require(__path__helpers + 'utils')
const categoryModel = require(__path__models + 'category')
const paramsHelpers = require(__path__helpers + 'params')
const folderViewsNews = __path__views__news + 'pages/category/'
const layoutNews = __path__views__news + 'frontend'
const controllerName = 'category'


/* GET ĩndex page. */
router.get('/:id', async function(req, res, next) {
  let idCategory = paramsHelpers.getParams(req.params, 'id', '')
  let keyword = paramsHelpers.getParams(req.query, 'search', '')
  const page = paramsHelpers.getParams(req.query, 'page', 1) 
  let itemsCategory = []
  let itemsInCategory = []
  let perPage = 4
  let totalItems = 1
  let pageRange = 3
  let category = ''

  await categoryModel.listItemsFrontend(null, {task: 'item-in-menu'}).then((items) => {
    itemsCategory = items
  })
  
  await articleModel.countArticleFrontend({id: idCategory }, {task: 'item-in-category'}).then((data) => {
    totalItems = data
  })
  let totalPages = Math.ceil(totalItems/perPage)

  await categoryModel.getItemFrontend({id: idCategory}).then((items) => {
    category = items
  })
  
  await articleModel.listItemsFrontend({ id: idCategory}, {task: 'item-in-category-page'})
  .skip((page - 1) * perPage)
  .limit(perPage)
  .then((items) => {
    itemsInCategory = items
  })
  itemsInCategory.forEach ((item, index) => {
    item.category = {
      id: item.category.id,
      name: item.category.name,
      view_type: category.view_type
    }
  }) 

  
  let paginationCatgoryPage = await utilsHelpers.paginate(page, totalPages, pageRange)
  
  res.render(`${folderViewsNews}category`, { 
    layout: layoutNews,
    itemsCategory,
    itemsInCategory,
    controllerName,
    totalPages,
    idCategory,
    pageTitle: 'Category',
    keyword,
    totalItems,
    paginationCatgoryPage,
    category
  }); 
});


module.exports = router;

