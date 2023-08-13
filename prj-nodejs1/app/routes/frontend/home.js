var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('themes/publish/index', { pageTitle: 'HomePage' });
});


module.exports = router;
