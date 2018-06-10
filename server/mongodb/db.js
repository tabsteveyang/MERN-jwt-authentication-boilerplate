const mongoose = require('mongoose');
const express = require('express');
const { User } = require('./schema/User');
const { Group } = require('./schema/Group');

const dbhost = process.env.DBHOST || 'mongodb://localhost:27017/Learner';
mongoose.connect(dbhost);

module.exports = {
    User,
    Group,
};

//var testgroup = new Group({
//    name: 'testgroup',
//    visibility: true,
//    session: [{
//        name: 'session1',
//        card: [{
//            question: 'test',
//            answer: '測試'
//        }]
//    }]
//});
//testgroup.save().then((doc) => {
//    console.log(JSON.stringify(doc, undefined, 2));
//});

//var testuser = new User({
//    name: 'testuser', 
//    pic: '', 
//    password: '123456', 
//    email: 'test@gmail.com', 
//    settings: {}, 
//    privilige: {}, 
//    enrollment: {}
//});
//testuser.save().then((doc) => {
//    console.log(JSON.stringify(doc, undefined, 2));
//});
