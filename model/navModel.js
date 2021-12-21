const mongoose = require('./core');

const navSchema = mongoose.Schema({
    title: { type: String },
    url: { type: String },  
    status: { type: Number, default: 1 },   
    add_time: {
        type: Number
    }
})

module.exports = mongoose.model('Nav', navSchema, 'nav')