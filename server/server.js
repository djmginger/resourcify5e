const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const connectDB = require('./db');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const testRouter = require('./routes/testAPI');
const registerRouter = require('./routes/register');
const loginRouter = require('./routes/login');
const charactersRouter = require('./routes/characters');
const characterDisplayRouter = require('./routes/characterDisplay');

const server = express();

// view engine setup
server.set('views', path.join(__dirname, 'views'));
server.set('view engine', 'jade');

server.use(cors());
server.use(logger('dev'));
server.use(express.json());
server.use(express.urlencoded({ extended: false }));
server.use(cookieParser());
server.use(express.static(path.join(__dirname, 'public')));

server.use('/', indexRouter);
server.use('/users', usersRouter);
server.use('/testAPI', testRouter);
server.use('/register', registerRouter);
server.use('/login', loginRouter);
server.use('/characters', charactersRouter);
server.use('/characterDisplay', characterDisplayRouter);

//Connect to DB
connectDB()
    .catch((error) => {
      console.error('Failed to connect to the database:', error.message);
      process.exit(1);
    });

// catch 404 and forward to error handler
server.use(function(req, res, next) {
  next(createError(404));
});

// error handler
server.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = server;
