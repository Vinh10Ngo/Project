var express = require('express');
var router = express.Router();

const middleGetUserInfo = require(__path__middleware + 'get-user-info')
const middleGetCategoryForMenu = require(__path__middleware + 'get-category-for-menu')
const middleGetMostPopularItems = require(__path__middleware + 'get-most-popular-items')
const middleGetConfigInfo = require(__path__middleware + 'get-config-info')


/* GET home page. */
router.use('/auth', require('./auth'));
router.use('/', middleGetUserInfo, middleGetCategoryForMenu, middleGetMostPopularItems, middleGetConfigInfo, require('./home'));
router.use('/blog-detail', require('./blog-detail'));
router.use('/category', require('./category'));
router.use('/about', require('./about'));
router.use('/blog-list', require('./blog-list'));
router.use('/contact', require('./contact'));

module.exports = router;
