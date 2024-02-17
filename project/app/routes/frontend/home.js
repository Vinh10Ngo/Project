var express = require('express');
var router = express.Router();

const articleModel = require(__path__models + 'article')
const paramsHelpers = require(__path__helpers + 'params')
const categoryModel = require(__path__models + 'category')
const folderViewsNews = __path__views__news + 'pages/home/'
const layoutNews = __path__views__news + 'frontend'
const utilsHelpers = require(__path__helpers + 'utils')

/* GET ĩndex page. */
router.get('/', async function(req, res, next) {
  let idCategory = paramsHelpers.getParams(req.params, 'id', '')
  let keyword = paramsHelpers.getParams(req.query, 'search', '')

  let itemsSpecial = []
  let itemsLatest = []
  let itemsInCategory = []
  let categoryInIndex = []
  let allArticle = []
  let totalItems = 1
  let userId = (req.user !== undefined) ? req.user.id : null


  await articleModel.listItemsFrontend(null, {task: 'item-special'}).then((items) => {
    itemsSpecial = items
  });
  await articleModel.listItemsFrontend(null, {task: 'item-latest'}).then((items) => {
    itemsLatest = items
  });
  
  await articleModel.listItemsFrontend({id: idCategory}, {task: 'item-in-category'}).then((items) => {
    itemsInCategory = items
  })
  await categoryModel.listItemsFrontend(null, {task: 'category-in-index'}).then((items) => {
    categoryInIndex = items
  })
  await articleModel.listItemsFrontend(null, {task: 'all'}).then((items) => {
    allArticle = items
  })

  await articleModel.countArticleFrontend({id: idCategory }, {task: 'item-in-category'}).then((data) => {
    totalItems = data
  })

 
  res.render(`${folderViewsNews}index`, { 
    layout: layoutNews,
    itemsSpecial,
    itemsLatest,
    itemsInCategory,
    categoryInIndex,
    pageTitle: 'Home',
    idCategory,
    keyword,
    totalItems,
    userId,
    allArticle
  });
})



module.exports = router;
