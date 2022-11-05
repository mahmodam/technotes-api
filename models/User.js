const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 50
    },
    password: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    },
    roles:[
        { 
            type: String,
            default: 'Employee'
        }
    ],
    active: { 
            type: Boolean,
            default: true
    }
    
});

module.exports = mongoose.model('User', userSchema);

