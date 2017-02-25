/**
 * File Name: users.js
 * Description: User model for authentication
 * Author: Shawn McLaughlin
 * Student ID: 300824398
 * Web App Name: https://comp308-w2017-midterm300824398.herokuapp.com/
 */

let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let passportLocalMongoose = require('passport-local-mongoose');

//create a model class
let usersSchema = Schema({
    username: {
        type: String,
        default: '',
        trim: true,
        required: 'Username is required.'
    },
    email: {
        type: String,
        default: '',
        trim: true,
        required: 'Email is required.'
    },
    displayName: {
        type: String,
        default: '',
        trim: true,
        required: 'Display name is required.'
    },
    created: {
        type: Date,
        default: Date.now,
    },
    updated: {
        type: Date,
        default: Date.now,
    }
}, {
    collection: "users"
});

let options = ({ missingPasswordError: "Wrong Password" });

usersSchema.plugin(passportLocalMongoose, options);

exports.User = mongoose.model('user', usersSchema);