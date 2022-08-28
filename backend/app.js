var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');

var usersRouter = require('./routes/users');
var userAuthRouter = require('./routes/user_auth');
var appointmentsRouter = require('./routes/appointments');
var reviewsRouter = require('./routes/reviews');

var app = express();

const fileupload = require("express-fileupload");
const cors = require("cors");
const bodyParser = require('body-parser');


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors());
app.use(fileupload());
app.use(express.static("files"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

app.use('/api/users', usersRouter);
app.use('/api/user_auth', userAuthRouter);
app.use('/api/appointments', appointmentsRouter);
app.use('/api/reviews', reviewsRouter);

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

/* BEGIN CRONJOBS */
const cron = require('node-cron');
const send_appointment_reminders = require('./chron_jobs/send_appointment_reminders');
const update_completed_hours = require('./chron_jobs/update_completed_hours');

// every day at 3am, send reminder emails
cron.schedule('0 3 * * *', send_appointment_reminders)

// every day at 3am, update completed tutoring/student hours
cron.schedule('0 3 * * *', update_completed_hours)

module.exports = app;
