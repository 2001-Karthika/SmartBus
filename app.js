const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');

require('dotenv').config()


const appRoute = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();

app.use(session({
  secret: 'mySecretKey',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 3600 * 1000 * 60 * 60 * 5 } // session will expire in 60 seconds
}));
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', appRoute);
app.use('/users', usersRouter);

app.listen(process.env.PORT, () =>{
  console.log(`SERVER STARTED at ${process.env.PORT}`)
})
