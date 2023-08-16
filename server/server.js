const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const connectDB = require('./db');
require('dotenv').config();

const frontendUrl = process.env.FRONTEND_URL;

const registerRouter = require('./routes/register');
const loginRouter = require('./routes/login');
const charactersRouter = require('./routes/characters');
const characterDisplayRouter = require('./routes/characterDisplay');
const profileRouter = require('./routes/profile');
const clericRouter = require('./routes/cleric')

const server = express();

// view engine setup
server.set('views', path.join(__dirname, 'views'));
server.set('view engine', 'jade');

server.use(cors({
    origin: frontendUrl, // this should match the URL of your frontend
    credentials: true,  // this enables cookies to be sent and received cross-origin
    allowedHeaders: [
        'set-cookie',
        'Content-Type',
        'Access-Control-Allow-Origin',
        'Access-Control-Allow-Credentials',
        'Authorization'
    ],
}));
server.use(logger('dev'));
server.use(express.json());
server.use(express.urlencoded({ extended: false }));
server.use(cookieParser());
server.use(express.static(path.join(__dirname, 'public')));

server.use('/register', registerRouter);
server.use('/login', loginRouter);
server.use('/characters', charactersRouter);
server.use('/characterDisplay', characterDisplayRouter);
server.use('/profile', profileRouter);
server.use('/cleric', clericRouter);

//Connect to DB
connectDB()
    .catch((error) => {
      console.error('Failed to connect to the database:', error.message);
      process.exit(1);
    });

module.exports = server;
