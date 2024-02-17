var express = require('express');
var router = express.Router ();

const controllerName = 'groups'
// const util = require('util')
const mainModel = require(__path__models + controllerName)
const usersModel = require(__path__models + 'users')
const utilsHelpers = require(__path__helpers + 'utils')
const notifyConfigs = require(__path__configs + 'notify');
const paramsHelpers = require(__path__helpers + 'params')
const mainValidate = require(__path__validates + controllerName)
const systemConfigs = require(__path__configs + 'system')
const notifyHelpers = require(__path__helpers + 'notify')
const { resourceLimits } = require('worker_threads');
const linkIndex = '/' + systemConfigs.prefixAdmin + `/${controllerName}/`

const pageTitleIndex = 'Group Manager::'
const pageTitleAdd = pageTitleIndex + 'Add'
const pageTitleEdit = pageTitleIndex + 'Edit'
const pageTitleList = pageTitleIndex + 'List'
const folderViewsAdmin = __path__views__admin + `pages/${controllerName}/`

/* GET users listing. */


//form
router.get('/form(/:id)?', function(req, res, next) {
  let id = paramsHelpers.getParams(req.params, 'id', '')
  let username = req.user.username
  // let {id} = req.params
  let item =  {name: '', ordering: 0, status: 'novalue', created: {user_name: username, time: Date.now()}, modified: {user_name: username, time: Date.now()}}
  let errors = null
  if(id !== '') {
   mainModel.getItems(id).then((item)=> {
    res.render(`${folderViewsAdmin}form`, { pageTitle: pageTitleEdit, controllerName, item, errors });
    })
  } else {
    res.render(`${folderViewsAdmin}form`, { pageTitle: pageTitleAdd, controllerName, item, errors });
  }
});

//SAVE
router.post('/save', async (req, res, next) => {
  req.body = JSON.parse(JSON.stringify(req.body));
  let item = Object.assign(req.body)
  let errors = mainValidate.validator(req)
  let oldnames = await mainModel.getItemsCondition({})
  let errorNameshake = utilsHelpers.isNameshake(oldnames, item.name)
  let username = req.user.username
  let taskCurrent = (item !== undefined && item.id !== '') ? 'edit' : 'add'
  if (taskCurrent == 'add') {
    if (errorNameshake !== false && errors == false) {
      errors = []
      errors.push({param: 'name', msg: errorNameshake})
    }
  }
  if(Array.isArray(errors) && errors.length > 0) {
    if (taskCurrent == 'add') {
      if (errors[0].msg == errorNameshake) errors.pop()
      if (errorNameshake !== false) errors.push({param: 'name', msg: errorNameshake})
    }
    let pageTitle = (taskCurrent == 'edit') ? pageTitleEdit : pageTitleAdd
    item.created = {user_name: null, time: null}
    item.modified = {user_name: null, time: null}
    res.render(`${folderViewsAdmin}form`, { pageTitle, item, controllerName, errors});
  } else {
      mainModel.saveItem(item, username, {task: taskCurrent}).then(result => {
        usersModel.saveItem(item, username, {task: 'change-groups-name'}).then(result => {
          notifyHelpers.show(req, res, linkIndex, {task: taskCurrent})
    })
  })
}
})

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
    mainModel.changeStatus(id, currentStatus, username, {task: "update-one"}).then(result => {
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
  // change-single-ordering
  router.post('/change-single-ordering', function(req, res, next) {
    let username = req.user.username
    let id = req.body.id
    let ordering = req.body.ordering
       mainModel.changeOrderingAjax(id, ordering, username).then(result => {
        res.send({'notify': {'tilte': notifyConfigs.ORDERING_SUCCESS, 'class': 'success'}})
     });      
    })
  //change ordering -  multi 
  router.post('/change-ordering', function(req, res, next) {
    let username = req.user.username
    let cids = req.body.cid
    let orderings = req.body.ordering
       mainModel.changeOdering(cids, orderings, username).then(result => {
        notifyHelpers.show(req, res, linkIndex, {task: 'change_ordering'})
     });      
    })
  });


//change groups_acp
router.post('/change-groups_acp/:id/:groups_acp', function(req, res, next) {
  let username = req.user.username
  let currentGroups_acp = paramsHelpers.getParams(req.params, 'groups_acp', 'yes')
  let id = paramsHelpers.getParams(req.params, 'id', '')
mainModel.groupsACP(id, currentGroups_acp, username).then(result => {
  res.send({groups_acp: (currentGroups_acp === 'yes') ? 'no' : 'yes' 
    })
  });  
});
module.exports = router;


