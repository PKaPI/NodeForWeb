var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session=require('express-session');//使用session

var creeper = require('./routes/creeper2');
var users = require('./routes/admin/login');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('html',require('ejs').__express);//设置视图目录及目标引擎
app.set('view engine', 'html');

app.use(session({
    secret:'user',
    resave:false,
    saveUninitalized:true,
    cookie:{maxAge:1000*3600}
}));
// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev')); //日志
app.use(bodyParser.json()); //处理表单请求并转成json格式
app.use(bodyParser.urlencoded({ extended: false }));//处理表单
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public'))); //内置中间件，解析静态资源
app.use(express.static(path.join(__dirname, 'views')));//解析静态资源

app.use('/', creeper);
app.use('/admin/users', users);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
