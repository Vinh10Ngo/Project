var express = require('express');
var router = express.Router();

const folderViewsNews = __path__views__news + 'pages/others/'
const systemConfigs = require(__path__configs + 'system')
const notifyHelpers = require(__path__helpers + 'notify')
const layoutNews = __path__views__news + 'frontend'
const controllerName = 'contact'
const sendEmailHelpers = require(__path__helpers + 'send-email')
const mainValidate = require(__path__validates + controllerName)
const paramsHelpers = require(__path__helpers + 'params')
const mainModel = require(__path__models + controllerName)
const configModel = require(__path__models + 'configuration')
const linkRedirect = ('/' + systemConfigs.prefixNews + `/${controllerName}/`).replace(/(\/)\1+/g, '$1')



/* GET ĩndex page. */
router.get('/', async function(req, res, next) {
  let errors = null
  let keyword = paramsHelpers.getParams(req.query, 'search', '')

  res.render(`${folderViewsNews}contact`, { 
    layout: layoutNews,
    pageTitle: 'Contact',
    controllerName,
    errors,
    keyword
    
  });
});
router.post('/save', function(req, res, next) {
  req.body = JSON.parse(JSON.stringify(req.body));;
  let item = Object.assign(req.body)
  let errors = mainValidate.validator(req)
  let username = req.user.username
  if(Array.isArray(errors) && errors.length > 0) {
    res.render(`${folderViewsNews}contact`, { 
      layout: layoutNews,
      pageTitle: 'Contact',
      controllerName,
      errors
    });
  }  else {
    Promise.all([
      mainModel.saveItem(item, username),
      configModel.getFormData({})
    ]).then(([savedItem, configInfo]) => {
      notifyHelpers.show(req, res, linkRedirect, {task: 'contact'});
      // Sử dụng savedItem và itemsList nếu cần
      sendEmailHelpers.sendEmail(savedItem, configInfo)
    })
  }
});

module.exports = router;
