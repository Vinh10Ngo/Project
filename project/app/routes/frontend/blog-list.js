var express = require('express');
var router = express.Router();

const paramsHelpers = require(__path__helpers + 'params')
const articleModel = require(__path__models + 'article')
const categoryModel = require(__path__models + 'category')
const utilsHelpers = require(__path__helpers + 'utils')

const folderViewsNews = __path__views__news + 'pages/blog-list/'
const layoutNews = __path__views__news + 'frontend'
const controllerName = 'blog-list'


/* GET ĩndex page. */
router.get('/', async function(req, res, next) {
  let idCategory = paramsHelpers.getParams(req.params, 'id', '')
  let keyword = paramsHelpers.getParams(req.query, 'search', '')
  const page = paramsHelpers.getParams(req.query, 'page', 1) 

  let itemsLatest = []
  let itemsKeyword = []
  let perPage = 3
  let totalItems = 1
  let pageRange = 3

 
  await articleModel.listItemsFrontend(null, {task: 'item-latest'}).then((items) => {
    itemsLatest = items
  });
  await articleModel.listItemsFrontend({ keyword: keyword}, {task: 'item-keyword'})
  .skip((page - 1) * perPage)
  .limit(perPage)
  .then((items) => {
    itemsKeyword = items
  })
  await articleModel.countArticleFrontend({keyword: keyword}, {task: 'item-keyword'}).then((data) => {
    totalItems = data
  })
  let totalPages = Math.ceil(totalItems/perPage)
  
  let paginationCatgoryPage = await utilsHelpers.paginate(page, totalPages, pageRange)
  

  res.render(`${folderViewsNews}blog-list`, { 
    layout: layoutNews,
    totalItems,
    controllerName,
    idCategory,
    keyword,
    pageTitle: 'Blog-list',
    itemsLatest,
    itemsKeyword,
    totalPages,
    paginationCatgoryPage,
  });
});


module.exports = router;
