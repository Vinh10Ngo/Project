var express = require('express');
var router = express.Router ();

const controllerName = 'contact'
// const util = require('util')
const mainModel = require(__path__models + controllerName)
const utilsHelpers = require(__path__helpers + 'utils')
const paramsHelpers = require(__path__helpers + 'params')
const systemConfigs = require(__path__configs + 'system')
const notifyHelpers = require(__path__helpers + 'notify')
const { resourceLimits } = require('worker_threads');
const linkIndex = '/' + systemConfigs.prefixAdmin + `/${controllerName}/`

const pageTitleIndex = 'Item Manager::'
const pageTitleList = pageTitleIndex + 'List'
const folderViewsAdmin = __path__views__admin + `pages/${controllerName}/`

/* GET users listing. */




//sort
router.get('/sort/:sort_field/:sort_type', function(req, res, next) {
req.session.sort_field = paramsHelpers.getParams(req.params, 'sort_field', 'ordering')
req.session.sort_type = paramsHelpers.getParams(req.params, 'sort_type', 'asc')

res.redirect(linkIndex)  
})
// List items
router.get('(/:status)?', async (req, res, next) => {
  let params = paramsHelpers.createParams(req)
  let statusFilter = await utilsHelpers.createFilterStatus(params.currentStatus, controllerName)

  await mainModel.countItems(params).then((data) => {
    params.pagination.totalItems = data
  })
  mainModel
  .listItems(params)
  .then((items) => {
    res.render(`${folderViewsAdmin}list`, { 
      pageTitle: pageTitleList,
      items: items, 
      statusFilter: statusFilter,
      controllerName,
      params
    });
  })
  //change status
  router.post('/change-status/:id/:status', function(req, res, next) {
    let username = req.user.username
    let currentStatus = paramsHelpers.getParams(req.params, 'status', 'active')
    let id = paramsHelpers.getParams(req.params, 'id', '')
    mainModel.changeStatus(id, currentStatus, username, {task: "update-one"}).then((result) => {
      res.send({status: (currentStatus === 'active') ? 'inactive' : 'active'})
    });  
  });
  //change status - multi 
  router.post('/change-status/:status', function(req, res, next) {
  let username = req.user.username
  let currentStatus = paramsHelpers.getParams(req.params, 'status', 'active')
    mainModel.changeStatus(req.body.cid, currentStatus, username, {task: "update-multi"}).then(result => {
      notifyHelpers.show(req, res, linkIndex, {task: 'change_status_multi', total: result.matchedCount})
    });
  });
  
  //delete
  router.get('/delete/:id/', function(req, res, next) {
    let id = paramsHelpers.getParams(req.params, 'id', '')
    mainModel.deleteItem(id, {task: 'delete-one'}).then(result => {
      notifyHelpers.show(req, res, linkIndex, {task: 'delete'})
  });
})
  
  // delete - multi 
  router.post('/delete', function(req, res, next) {
    mainModel.deleteItem(req.body.cid, {task: 'delete-many'}).then(result => {
      notifyHelpers.show(req, res, linkIndex, {task: 'delete_multi', total: result.deletedCount})
    });  
  });
 
});

module.exports = router;


