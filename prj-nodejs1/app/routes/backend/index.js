var express = require('express');
var router = express.Router();

/* GET home page. */
router.use('/', require('./home'));
router.use('/themes', require('./themes'));

module.exports = router;
