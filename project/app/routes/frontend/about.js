var express = require('express');
var router = express.Router();

const folderViewsNews = __path__views__news + 'pages/others/'
const layoutNews = __path__views__news + 'frontend'
const controllerName = 'about'
const paramsHelpers = require(__path__helpers + 'params')


/* GET ĩndex page. */
router.get('/', async function(req, res, next) {
  let keyword = paramsHelpers.getParams(req.query, 'search', '')
  res.render(`${folderViewsNews}about`, { 
    pageTitle: 'About',
    layout: layoutNews,
    controllerName,
    keyword
  });
});


module.exports = router;
