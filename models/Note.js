const mongoose = require('mongoose');
// npm i mongoose-sequence
const AutoIncrement = require('mongoose-sequence')(mongoose);

const noteSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    title: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 1024
    },
    text: {
        type: String,
        required: true
    },
    completed: { 
            type: Boolean,
            default: false
    }
    
},
{
    timestamps: true
}
);

noteSchema.plugin(AutoIncrement, {
    inc_field: 'ticket',
    id: 'ticketNums',
    start_seq: 500
});

module.exports = mongoose.model('Note', noteSchema);