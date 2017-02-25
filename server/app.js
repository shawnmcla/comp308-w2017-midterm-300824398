/**
 * File Name: app.js
 * Description: Main application entry point
 * Author: Shawn McLaughlin
 * Student ID: 300824398
 * Web App Name: https://comp308-w2017-midterm300824398.herokuapp.com/
 */

// modules required for the project
let express = require('express');
let path = require('path'); // part of node.js core
let favicon = require('serve-favicon');
let logger = require('morgan');
let cookieParser = require('cookie-parser');
let bodyParser = require('body-parser');
//auth modules
let session = require('express-session');
let passport = require('passport');
let passportlocal = require('passport-local');
let LocalStrategy = passportlocal.Strategy;
let flash = require('connect-flash'); //display errors/login messages


// import "mongoose" - required for DB Access
let mongoose = require('mongoose');
// URI
let config = require('./config/db');

mongoose.connect(process.env.URI || config.URI);

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
    console.log("Conneced to MongoDB...");
});

// define routers
let index = require('./routes/index'); // top level routes
let books = require('./routes/books'); // routes for books

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /client
app.use(favicon(path.join(__dirname, '../client', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../client')));

// setup sessions
app.use(session({
    secret: "SeizeTheMeansOfProduction",
    saveUninitialized: true,
    resave: true
}));

//initialize passport and flash
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());

//route redirects
app.use('/', index);
app.use('/books', books);

//Passport User Configuration
let UserModel = require('./models/users');
let User = UserModel.User;
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());



// Handle 404 Errors
app.use(function(req, res) {
    res.status(400);
    res.render('errors/404', {
        title: '404: File Not Found'
    });
});

// Handle 500 Errors
app.use(function(error, req, res, next) {
    res.status(500);
    res.render('errors/500', {
        title: '500: Internal Server Error',
        error: "Error"
    });
});

module.exports = app;