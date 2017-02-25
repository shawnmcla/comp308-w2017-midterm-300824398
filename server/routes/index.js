/**
 * File Name: index.js
 * Description: Main routes
 * Author: Shawn McLaughlin
 * Student ID: 300824398
 * Web App Name: https://comp308-w2017-midterm300824398.herokuapp.com/
 */

// modules required for routing
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');
let passport = require('passport');
// define the book model
let book = require('../models/books');
// define user models
let UserModel = require('../models/users');
let User = UserModel.User;
/* GET home page. wildcard */
router.get('/', (req, res, next) => {
    res.render('content/index', {
        title: 'Home',
        books: ''
    });
});

/* GET login page */
router.get('/login', (req, res, next) => {
    //check to see if user is not already logged in
    if (!req.user) {
        res.render('auth/login', {
            title: 'Login',
            books: '',
            messages: req.flash('loginMessage'),
            displayName: req.user ? req.user.displayName : ''
        });
        return;
    } else {
        return res.redirect('/books'); // redirect to books list
    }
});
// POST /login - Process user login request
router.post('/login', passport.authenticate('local', {
    successRedirect: '/books',
    failureRedirect: '/login',
    failureFlash: true
}));

// GET /register - Fetch registration page
router.get('/register', (req, res, next) => {
    //check if user not already logged in
    if (!req.user) {
        res.render('auth/register', {
            title: 'Register',
            books: '',
            messages: req.flash('registerMessage'),
            displayName: req.user ? req.user.displayName : ''
        });
    }
});

// POST /register - Process user registration
router.post('/register', (req, res, next) => {
    User.register(
        new User({
            username: req.body.username,
            email: req.body.email,
            displayName: req.body.displayName
        }),
        req.body.password,
        (err) => {
            if (err) {
                console.log('Error registering user.');
                console.log(err);
                if (err.name == "UserExistsError") {
                    req.flash('registerMessage', "Registration Error: User already exists!");
                }
                res.render('auth/register', {
                    title: 'Register',
                    books: '',
                    messages: req.flash('registerMessage'),
                    displayName: req.user ? req.user.displayName : ''
                });
            }
            // if registration is successful
            return passport.authenticate('local')(req, res, () => {
                res.redirect('/books');
            });
        });
});

// GET /logout - logout the user and redir. to homepage
router.get('/logout', (req, res, next) => {
    req.logout();
    res.redirect('/');
});

module.exports = router;