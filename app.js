
var createError = require('http-errors');
var passport = require('passport');
var mongoose = require('mongoose');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('./config/passport');

var indexRouter = require('./routes/todoRoutes');

var app = express();

// Connect to MongoDB and create/use database called todoAppTest
mongoose.connect('mongodb://localhost:27017/todoAppTest',{useCreateIndex:true, useNewUrlParser: true , useUnifiedTopology: true}).then(() =>  console.log('connection succesful'))
.catch((err) => console.error(err));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, './public')));
app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
