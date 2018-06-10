const mongoose = require('mongoose');

module.exports.Group = mongoose.model('Group', {
    name: {
        type: String,
        required: true
    },       
    visibility: {
        type: Boolean,
        default: false
    },
    timestamp: {
        type: Date,
        default: Date.now
    },
    session: [{
        pic: {
            type: String,
            default: ''
        },
        name: {
            type: String,
            required: true
        },
        card: [{
            question: {
                type: String,
                minlength: 1,
                trim: true,
                required: true
            },
            answer: {
                type: String,
                minlength: 1,
                trim: true,
                required: true
            },
            timestamp: {
                type: Date,
                default: Date.now
            }
        }]
    }]
});
