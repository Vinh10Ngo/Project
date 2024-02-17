var express = require('express');
var router = express.Router ();

const controllerName = 'article'
const he = require('he')
var slug = require('slug')

const mainModel = require(__path__models + controllerName)
const categoryModel = require(__path__models + 'article')
const fileHelpers  = require(__path__helpers + 'file')
const utilsHelpers = require(__path__helpers + 'utils')
const paramsHelpers = require(__path__helpers + 'params')
const mainValidate = require(__path__validates + controllerName)
const systemConfigs = require(__path__configs + 'system')
const notifyHelpers = require(__path__helpers + 'notify')
const notifyConfigs = require(__path__configs + 'notify')

const { resourceLimits } = require('worker_threads');
const linkIndex = '/' + systemConfigs.prefixAdmin + `/${controllerName}/`

const pageTitleIndex = 'Article Manager::' 
const pageTitleAdd = pageTitleIndex + 'Add'
const pageTitleEdit = pageTitleIndex + 'Edit'
const pageTitleList = pageTitleIndex + 'List'
const folderViewsAdmin = __path__views__admin + `pages/${controllerName}/`
const uploadThumb = fileHelpers.uploadFile('thumb', 'article')
const uploadLink = 'public/uploads/article/'

/* GET article listing. */


//form
router.get('/form(/:id)?', async function(req, res, next) {
  let id = paramsHelpers.getParams(req.params, 'id', '')
  let username = req.user.username
  let item =  {name: '', ordering: 0, status: 'novalue', category_id: '', category_name: '', content: '', slug: '', created: {user_name: username, time: Date.now()}, modified: {user_name: username, time: Date.now()}}
  let errors = null
  let categoryItems = []
  await categoryModel.listItemInSelectBox().then((item) => {
    categoryItems = item
    categoryItems.unshift({_id: 'novalue', name: 'Choose category'})
  })
  if(id !== '') {
  mainModel.getItems(id).then((item)=> {
    item.slug = slug(item.name)
    item.category_id = item.category.id
    item.category_name = item.category.name
    res.render(`${folderViewsAdmin}form`, { pageTitle: pageTitleEdit, controllerName, item, errors, categoryItems });
  })
  } else {
    item.slug = slug(item.name)
    res.render(`${folderViewsAdmin}form`, { pageTitle: pageTitleAdd, controllerName, item, errors, categoryItems });
  }
});


//SAVE
router.post('/save', (req, res, next) => {
  uploadThumb (req, res, async (err) => {
    req.body = JSON.parse(JSON.stringify(req.body));
    let item = Object.assign(req.body)
    item.slug = slug(item.name)
    item.content = he.decode(item.content)
    let username = req.user.username
    item.thumb = (req.file == undefined) ? null : req.file.filename
    let taskCurrent = (item !== undefined && item.id !== '') ? 'edit' : 'add'
    let errors = mainValidate.validator(req, item, err, taskCurrent)

    if(Array.isArray(errors) && errors.length > 0) {
      let categoryItems = []     
      await categoryModel.listItemInSelectBox().then((item) => {
        categoryItems = item
        categoryItems.unshift({_id: 'novalue', name: 'Choose category'})
      })
      await fileHelpers.remove(uploadLink, item.thumb)
      item.thumb = 'no-avatar.jpeg'
      if(taskCurrent == 'edit') item.thumb = item.image_old
      item.created = {user_name: null, time: null}
      item.modified = {user_name: null, time: null}
      let pageTitle = (taskCurrent == 'edit') ? pageTitleEdit : pageTitleAdd
      res.render(`${folderViewsAdmin}form`, { pageTitle, item, controllerName, errors, categoryItems});
    } else {
        if (req.file == undefined) {
          item.thumb = item.image_old
          console.log('item.image_old: ', item.image_old);
        } else {
          item.thumb = req.file.filename
          if (taskCurrent == 'edit') fileHelpers.remove(uploadLink, item.image_old)
        }
        mainModel.saveItem(item, username, {task: taskCurrent}).then(result => {
          notifyHelpers.show(req, res, linkIndex, {task: taskCurrent})
        })
      }
  }) 
})

//sort
router.get('/sort/:sort_field/:sort_type', function(req, res, next) {
req.session.sort_field = paramsHelpers.getParams(req.params, 'sort_field', 'ordering')
req.session.sort_type = paramsHelpers.getParams(req.params, 'sort_type', 'asc')

res.redirect(linkIndex)  
})
// filter category
router.get('/filter-category/:category_id', function(req, res, next) {
  // lấy category_id được truyền qua, lưu vào session với giá trị là category_id
  req.session.category_id = paramsHelpers.getParams(req.params, 'category_id', '')
  // trả về linkIndex rơi vào trường hợp (/:status)?
  res.redirect(linkIndex)  
  })
// List items
router.get('(/:status)?', async (req, res, next) => {
  let params = paramsHelpers.createParams(req)
  let statusFilter = await utilsHelpers.createFilterStatus(params.currentStatus, controllerName)
  let categoryItems = []
  
  await mainModel.countItems(params).then((data) => {
    params.pagination.totalItems = data

  })
  await categoryModel.listItemInSelectBox().then((item) => {
    categoryItems = item
    categoryItems.unshift({_id: 'allvalue', name: 'All category'})
  }) 
  mainModel
  .listItems(params)
  .then((items) => {
    res.render(`${folderViewsAdmin}list`, { 
      pageTitle: pageTitleList,
      items: items, 
      statusFilter: statusFilter,
      controllerName,
      categoryItems,
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
  // change category
  router.post('/change-category', function(req, res, next) {
   let id = req.body.id
   let username = req.user.username
   let categoryID = req.body.category_id
   let categoryName = req.body.category_name
   mainModel.changecategory(id, categoryID, categoryName, username).then(result => {
    res.send({})
    });
  })
  
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
  // change - single - ordering
  router.post('/change-single-ordering', function(req, res, next) {
    let username = req.user.username
    let id = req.body.id
    let ordering = req.body.ordering
       mainModel.changeOrderingAjax(id, ordering, username).then(result => {
        res.send({'notify': {'tilte': notifyConfigs.ORDERING_SUCCESS, 'class': 'success'}})
     });      
    })
  //change ordering -   multi 
  router.post('/change-ordering', function(req, res, next) {
    let username = req.user.username
    let cids = req.body.cid
    let orderings = req.body.ordering
       mainModel.changeOdering(cids, orderings, username).then(result => {
        notifyHelpers.show(req, res, linkIndex, {task: 'change_ordering'})
     });      
    })
     //change special
  router.post('/change-special/:id/:special', function(req, res, next) {
    let username = req.user.username
    let currentSpecial = paramsHelpers.getParams(req.params, 'special', 'yes')
    let id = paramsHelpers.getParams(req.params, 'id', '')
    mainModel.special(id, currentSpecial, username).then(result => {
      res.send({special: (currentSpecial === 'yes') ? 'no' : 'yes' 
      })
    });  
  });
});
 
module.exports = router;


