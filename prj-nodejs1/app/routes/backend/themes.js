var express = require('express');
var router = express.Router ();

const util = require('util')
const itemsModel = require(__path__schemas + 'items')
const utilsHelpers = require(__path__helpers + 'utils')
const paramsHelpers = require(__path__helpers + 'params')
const validateItems = require(__path__validates + 'items')
const systemConfigs = require(__path__configs + 'system')
const notifyConfigs = require(__path__configs + 'notify');
const { resourceLimits } = require('worker_threads');
const linkIndex = '/' + systemConfigs.prefixAdmin + '/themes/'

const pageTitleIndex = 'Book Manager::'
const pageTitleAdd = pageTitleIndex + 'Add'
const pageTitleEdit = pageTitleIndex + 'Edit'
const pageTitleList = pageTitleIndex + 'List'
const folderViews = __path__views + 'themes/'

/* GET users listing. */
router.get('/login', function(req, res, next) {
  res.render(`${folderViews}login`, {pageTitle: 'Admin' });
});
router.get('/dashboard', async(req, res, next) => {
  let countItems = 0
  await itemsModel.count({}).then((data) => {
    countItems = data
  })
  res.render(`${folderViews}dashboard`, {
     pageTitle: 'Dashboard',
     countItems: countItems 
  });
});
router.get('/form(/:id)?', function(req, res, next) {
  let id = paramsHelpers.getParams(req.params, 'id', '')
  let item =  {name: '', ordering: 0, status: 'novalue'}
  let errors = null
  if(id) {
    itemsModel.findById(id).then((item)=> {
      res.render(`${folderViews}form`, { pageTitle: pageTitleEdit, item: item, errors });
    })
  } else {
    res.render(`${folderViews}form`, { pageTitle: pageTitleAdd, item, errors });
  }
});

//ADD
router.post('/save', (req, res, next) => {
  req.body = JSON.parse(JSON.stringify(req.body));
  validateItems.validator(req)
  let item = Object.assign(req.body)
  let errors = req.validationErrors()
  if(typeof item !== 'undefined' && item.id !== '') { //edit
if (errors) {
    res.render(`${folderViews}form`, { pageTitle: pageTitleEdit, item, errors});
  } else {
    itemsModel.updateOne({_id: item.id},
       {status: item.status, 
        ordering: parseInt(item.ordering),
        name: item.name
      }).then(result => {
      req.flash('success', notifyConfigs.EDIT_SUCCESS , false);
      res.redirect(linkIndex)
    }); 
  }
  } else { //add
  if (errors) {
    res.render(`${folderViews}form`, { pageTitle: pageTitleAdd, item, errors});
  } else {
    new itemsModel(item).save().then(() => {
      req.flash('success',notifyConfigs.ADD_SUCCESS, false);
      res.redirect(linkIndex)
    })
  }
  }

})

// List themes
router.get('(/:status)?', async (req, res, next) => {
  let objWhere = {}
  let keyword = paramsHelpers.getParams(req.query, 'keyword', '')
  console.log(keyword)
  let currentStatus = paramsHelpers.getParams(req.params, 'status', 'all')
  let statusFilter = await utilsHelpers.createFilterStatus(currentStatus)
  let pagination = {
    totalItems: 1,
    totalItemsPerPage : 3,
    pageRanges: 3,
    currentPage : parseInt(paramsHelpers.getParams(req.query, 'page', 1)) 
  } 

  if (currentStatus !== 'all') {
    objWhere.status = currentStatus
  }
  if (keyword !== '') {
    objWhere.name = new RegExp(keyword, 'i')
  }

  await itemsModel.count(objWhere).then((data) => {
    pagination.totalItems = data
  })
  console.log(pagination.totalItems)
  itemsModel
  .find(objWhere)
  .sort({ordering: 'asc'})
  .skip((pagination.currentPage-1)*pagination.totalItemsPerPage)
  .limit(pagination.totalItemsPerPage)
  .then((items) => {
    res.render(`${folderViews}list`, { 
      pageTitle: pageTitleList,
      items: items, 
      statusFilter: statusFilter,
      pagination,
      currentStatus,
      keyword
    });
  })
  //change status
  router.get('/change-status/:id/:status', function(req, res, next) {
    let currentStatus = paramsHelpers.getParams(req.params, 'status', 'active')
    let id = paramsHelpers.getParams(req.params, 'id', '')
    let status = (currentStatus === 'active') ? 'inactive' : 'active'
    itemsModel.updateOne({_id: id}, {status: status}).then(result => {
      req.flash('success', notifyConfigs.STATUS_SUCCESS, false);
      res.redirect(linkIndex)
    });  
  });
  //change status - multi 
  router.post('/change-status/:status', function(req, res, next) {
    let currentStatus = paramsHelpers.getParams(req.params, 'status', 'active')
    itemsModel.updateMany({_id: {$in: req.body.cid}}, {status: currentStatus}).then(result => {
      console.log(result)
      req.flash('success', util.format(notifyConfigs.STATUS_MULTI_SUCCESS, result.matchedCount), false);
      res.redirect(linkIndex)
    });  
  });
  
  //delete
  router.get('/delete/:id/', function(req, res, next) {
    let id = paramsHelpers.getParams(req.params, 'id', '')
    itemsModel.deleteOne({_id: id}).then(result => {
      req.flash('success', notifyConfigs.DELETE_SUCCESS, false);
      res.redirect(linkIndex)
    });  
  });
  // delete - multi 
  router.post('/delete', function(req, res, next) {
    itemsModel.deleteMany({_id: {$in: req.body.cid}}).then(result => {
      req.flash('success', util.format(notifyConfigs.DELETE_MULTI_SUCCESS, result.deletedCount), false);
      res.redirect(linkIndex)
    });  
  });
  //change ordering - multi 
  router.post('/change-ordering', function(req, res, next) {
    let cids = req.body.cid
    let orderings = req.body.ordering
    if(Array.isArray(cids)) {
      cids.forEach((item, index) => {
        itemsModel.updateOne({_id: item}, {ordering: parseInt(orderings[index])}).then(result => {
        }) 
      })  
    } else {
       itemsModel.updateOne({_id: cids}, {ordering: parseInt(orderings)}).then(result => {
     });      
    }
    req.flash('success', notifyConfigs.ORDERING_SUCCESS, false);
    res.redirect(linkIndex)
  });
});




module.exports = router;


