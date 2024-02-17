var express = require('express');
var router = express.Router ();

const controllerName = 'dashboard'
// const util = require('util')
const itemsModel = require(__path__models + 'items')
const usersModel = require(__path__models + 'users')
const groupsModel = require(__path__models + 'groups')
const categoryModel = require(__path__models + 'category')
const articleModel = require(__path__models + 'article')
const contactModel = require(__path__models + 'contact')

const paramsHelpers = require(__path__helpers + 'params')
const folderViewsAdmin = __path__views__admin + `pages/${controllerName}/`

/* GET users listing. */

router.get('/', async(req, res, next) => {
  let countItems = 0
  let countUsers = 0
  let countGroups = 0
  let countCategory = 0
  let countArticle = 0
  let countContact = 0

  let params = paramsHelpers.createParams(req)
  await itemsModel.countItems(params).then((data) => {
    countItems = data
  })
  await usersModel.countItems(params).then((data) => {
    countUsers = data
  })
  await groupsModel.countItems(params).then((data) => {
    countGroups = data
  })
  await categoryModel.countItems(params).then((data) => {
    countCategory = data
  })
  await articleModel.countItems(params).then((data) => {
    countArticle = data
  })
  await contactModel.countItems(params).then((data) => {
    countContact = data
  })

  res.render(`${folderViewsAdmin}dashboard`, {
     pageTitle: 'Dashboard',
     countItems,
     countUsers,
     countGroups,
     countCategory,
     countArticle,
     countContact 

  });
});



module.exports = router;


