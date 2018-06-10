const mongoose = require('mongoose');

module.exports.User = mongoose.model('User', {
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
    }]
}); 
