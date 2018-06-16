const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { writeLog } = require('../../utils/logger');

const TOKEN_SALT = JSON.stringify(process.env.TOKEN_SALT);

//mongoose Schema object.
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 6,
        trim: true
    },
    pic: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        trim: true,
        minlength: 6   
    },
    lastupload: {
        type: Date
    },
    settings: [{
        language: {
            type: String,
            default: 'EN',
            validator: (value) => {
                let whiteList = ['EN'];
                if(whiteList.indexOf(value) === -1)
                    return false;
            }
        },
        session_card_limit: {
            type: Number,
            default: 30,
            validator: (value) => {
                let whiteList = [30, 50];
                if(whiteList.indexOf(value) === -1)
                    return false;
            }
        }
    }],
    privilige: [{
        isActivate: {
            type: Boolean,
            default: false
        },
        setting: {
            type: Boolean,
            default: false
        },
        enroll: {
            type: Boolean,
            default: false
        },
        create: {
            type: Boolean,
            default: false
        },
        play: {
            type: Boolean,
            default: true
        },
        isAdmin: {
            type: Boolean,
            default: false
        }
    }],
    enrollment: [{
        gid: Number,
        default: ''
    }],
    tokens: [{
        type: String,
        required: true
    }]
}); 

//object.methods -> the method for objects(not for the class).
UserSchema.methods.generateAuthToken = function(){
    const user = this;
    //A. to prevent tokens array growing without a limit:
    const tokenLimit = 3;
    if(user.tokens.length >= tokenLimit){
        user.tokens.shift(); //if over the limit -> remove the oldest one.
    }
    //B. create new token:
    const access = user.privilige.toObject()[0];
    const token = jwt.sign({uid: user._id.toHexString(), name: user.name, email: user.email, access}, TOKEN_SALT).toString();
    //can clear the user.tokens array before adding, to limit the login-session, but we keep all the session in this project.
    user.tokens = user.tokens.concat([token]); //add the token into user's tokens array.
    //C. commit the changes above:
    return user.save().then(() => {
        return token;
    });
}; 
UserSchema.methods.removeAuthToken = function(token){
    const user = this;
    if(token){
        try{
            //remove only one token.
            const targetIndex = user.tokens.indexOf(token);
            if(targetIndex !== -1){
                user.tokens = user.tokens.filter( (elm, index) => index !== targetIndex );
                return user.save();
            }
        }catch(e){
            writeLog(e, {file: 'server/mongodb/schema/User.js:118'});
            return Promise.reject();
        }
    }else{
        try{
            //remove all the tokens.
            if(user.tokens.length > 0){
                user.tokens = [];
                return user.save();
            }
        }catch(e){
            writeLog(e, {file: 'server/mongodb/schema/User.js:129'});
            return Promise.reject();
        }
    }
};

//pre save mongoose Schema middleware: for hashing password.
UserSchema.pre('save', function(next){
    const user = this;
    if(user.isModified('password')){
        bcrypt.genSalt(10, (err, salt) => { //generate salt by bcrypt and use it to hash the password.
            bcrypt.hash(user.password, salt, (err, hash) => {
                user.password = hash;
                next();
            });
        });
    }else{
        next();
    }
});

//UserSchema class static methods:
//for login verify.
UserSchema.statics.findByCredentials = function(email, password){
    let user = this;
    //create a promise chain.
    return user.findOne({email}).then((userData) => {
        //if user doesn't exist -> reject the promise.
        if(!userData){
            return Promise.reject();
        }
        //if user exist -> check the password.
        return new Promise((resolve, reject) => {
            bcrypt.compare(password, userData.password, (err, res) => {
                //check the password is valid or not.
                if(res){
                    resolve(userData);
                }else{
                    reject();
                }
            });
        });
    });
}

//mongoose model.
const User = mongoose.model('User', UserSchema);
module.exports = { User }
