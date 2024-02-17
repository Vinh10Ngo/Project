var express = require('express');
const md5 = require('md5');
var router = express.Router();

const passport = require('passport')

const systemConfigs = require(__path__configs + 'system')
const controllerName = 'auth'
const notifyConfigs = require(__path__configs + 'notify')
const layoutNews = __path__views__news + 'frontend'
const folderViewsNews = __path__views__news + `pages/${controllerName}/`
const layoutLogin = __path__views__news + 'login' 
const mainValidate = require(__path__validates + controllerName)
const linkRedirect = ('/' + systemConfigs.prefixNews + `/${controllerName}/`).replace(/(\/)\1+/g, '$1')
const usersModel = require(__path__models + 'users')
const middleGetCategoryForMenu = require(__path__middleware + 'get-category-for-menu')
const middleGetMostPopularItems = require(__path__middleware + 'get-most-popular-items')
const middleGetUserInfo = require(__path__middleware + 'get-user-info')
const middleGetConfigInfo = require(__path__middleware + 'get-config-info')

router.get('/login', function(req, res, next) {
  if (req.isAuthenticated()) {
    res.redirect(`/${systemConfigs.prefixNews}`)
  }
    let errors = null
    res.render(`${folderViewsNews}login`, {
        errors,
        controllerName,
        pageTitle: 'Admin',
        layout: layoutLogin,
     });
});


router.get('/logout', function(req, res, next) {
  req.logout(function(err) {
    if (err) { 
      return next(err); 
    }
    res.redirect(`${linkRedirect}login`);
  });
});

router.get('/change-password', function(req, res, next) {
  let errors = null
  res.render(`${folderViewsNews}change-password`, {
    layout: layoutLogin,
    pageTitle: 'Change Password',
    controllerName,
    errors
  });
})

router.post('/change-password/post', function(req, res, next) {
  if (req.isAuthenticated()) {
    req.body = JSON.parse(JSON.stringify(req.body));
    let item = Object.assign(req.body);
    let errors = mainValidate.validator(req);
    let username = req.user.username
    errors = errors.filter(element => element.param !== 'username');
    if (item.password !== '') passwordMd5 = md5(item.password)
    if (item.new_password !== '') newPasswordMd5 = md5(item.new_password)
    if (item.confirm_new_password !== '') confirmNewPasswordMd5 = md5(item.confirm_new_password)
    if (item.password !== '' && item.new_password !== '' && item.confirm_new_password !== '') {
      if (passwordMd5 !== req.user.password) errors.push({param: 'Password', msg: notifyConfigs.ERROR_WRONG_PASSWORD})
      if (passwordMd5 == newPasswordMd5) errors.push({param: 'Trùng mật khẩu', msg: notifyConfigs.ERROR_DUPLICATE_PASSWORD})
      if (newPasswordMd5 !== confirmNewPasswordMd5) errors.push({param: 'Confirm New Password', msg: notifyConfigs.ERROR_CONFIRM_PASSWORD})    
    }
    if (Array.isArray(errors) && errors.length > 0) {
      res.render(`${folderViewsNews}change-password`, {
        layout: layoutLogin,
        pageTitle: 'Change Password',
        controllerName,
        errors
      })
    } else {
      usersModel.saveItem(req.user, username, {task: 'change-password'}, item).then(result => {
        res.redirect(`${linkRedirect}login`)
      })
    }
  } else {
    res.redirect(`${linkRedirect}login`)
  }
})

router.get('/no-permission', middleGetConfigInfo, middleGetUserInfo, middleGetCategoryForMenu, middleGetMostPopularItems, async(req, res, next) => {
  res.render(`${folderViewsNews}no-permission`, {
    layout: layoutNews,
    pageTitle: 'No Permission',
 });
});
  
router.post('/post', (req, res, next) => {
  if (req.isAuthenticated()) {
    res.redirect(`/${systemConfigs.prefixNews}`)
  }
    req.body = JSON.parse(JSON.stringify(req.body));
    let item = Object.assign(req.body);
    let errors = mainValidate.validator(req);
    errors = errors.filter(element => element.param !== 'new_password' && element.param !== 'confirm_new_password');

    if (Array.isArray(errors) && errors.length > 0) {
      console.log('có lỗi');
         res.render(`${folderViewsNews}login`, {
            item,
            errors,
            controllerName,
            pageTitle: 'Admin',
            layout: layoutLogin
        });
    } else {
      console.log('không có lỗi');
      passport.authenticate('local', {
        successRedirect: `/${systemConfigs.prefixNews}`,
        failureRedirect: `${linkRedirect}login`,
        failureFlash: true
      })(req, res, next)
    }
  });

 


  
module.exports = router