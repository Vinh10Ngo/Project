var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
const validator = require('express-validator');

const flash = require('express-flash-notification');
const session = require('express-session');

var expressLayouts = require('express-ejs-layouts');
var mongoose = require('mongoose')

var pathConfig = require('./path');

//define path 
global.__base =  __dirname + '/'
global.__path__app =  __base + pathConfig.folder__app + '/'
global.__path__configs =  __path__app + pathConfig.folder__configs + '/'
global.__path__helpers =  __path__app + pathConfig.folder__helpers + '/'
global.__path__routes =  __path__app + pathConfig.folder__routes + '/'
global.__path__schemas =  __path__app + pathConfig.folder__schemas + '/'
global.__path__validates =  __path__app + pathConfig.folder__validates + '/'
global.__path__views =  __path__app + pathConfig.folder__views + '/'


const systemConfigs = require(__path__configs + 'system')
const databaseConfigs = require(__path__configs + 'database')

mongoose.connect(`mongodb+srv://${databaseConfigs.database}:${databaseConfigs.password}@cluster0.1r1zsfn.mongodb.net/items`);
mongoose.connection.once('open', function() {
  console.log('Mongodb Running')
}).on('error', function(err){
  console.log(err)
})

var app = express();

app.use(validator({
  customValidators: {
    isNotEqual: (value1, value2) => {
      return value1!== value2
    }
  }
}))

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(cookieParser());
app.use(session({
  resave: true, 
  saveUninitialized: true, 
  secret: 'somesecret', 
  cookie: { maxAge: 60000 }}));
app.use(flash(app, {
  viewName: __path__views + 'flash'
}));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(expressLayouts);
app.set('layout', __path__views + 'backend');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.locals.systemConfigs = systemConfigs
app.use(`/${systemConfigs.prefixAdmin}`, require(__path__routes + '/backend/index'));
app.use('/', require(__path__routes + '/frontend/index'));




// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

//ket noi bang duong dan nay cho vscode
//mongodb+srv://project-nodejs:Iksss.Red.09@cluster0.1r1zsfn.mongodb.net/


// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render(__path__views + 'error', { pageTitle: 'Page Not Found' });
});

module.exports = app;
