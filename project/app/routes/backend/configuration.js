var express = require('express');
var router = express.Router ();

const controllerName = 'configuration'
// const util = require('util')
const mainModel = require(__path__models + controllerName)
const systemConfigs = require(__path__configs + 'system')
const notifyHelpers = require(__path__helpers + 'notify')
const linkIndex = '/' + systemConfigs.prefixAdmin + '/dashboard/'
const fileHelpers  = require(__path__helpers + 'file')
const uploadLogo = fileHelpers.uploadFile('info[logo]', 'config')
const uploadLink = 'public/uploads/config/'

const pageTitleIndex = 'Item Manager::'
const pageTitleEdit = pageTitleIndex + 'Edit'
const folderViewsAdmin = __path__views__admin + `pages/${controllerName}/`

/* GET users listing. */


//form

router.get('/', async function(req, res, next) {
  await mainModel.getFormData({}).then(item => {
    res.render(`${folderViewsAdmin}config-form`, { pageTitle: pageTitleEdit, controllerName, item });
  })
});


//SAVE
router.post('/save', (req, res, next) => {
  uploadLogo (req, res, (err) => {
    req.body = JSON.parse(JSON.stringify(req.body));
    let item = Object.assign(req.body)
    let username = req.user.username
    if (req.file == undefined) {
      item.info.logo = item.info.image_old
    } else {
      item.info.logo = req.file.filename
        if (item.info.image_old) fileHelpers.remove(uploadLink, item.info.image_old)
    }
      mainModel.saveItem(item, username, null).then((saveItemResult) => {
        notifyHelpers.show(req, res, linkIndex, { task: 'edit' });
      })
  })
})




module.exports = router;


