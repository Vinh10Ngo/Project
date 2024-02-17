var express = require('express');
var router = express.Router();

const folderViewsAdminAmin = __path__views__admin + 'pages/home/'

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render(`${folderViewsAdmin}index`, { pageTitle: 'HomePage' });
});


module.exports = router;
