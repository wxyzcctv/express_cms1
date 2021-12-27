const mongoose = require('./core');

const focusSchema = mongoose.Schema({
    title: { type: String },
    type: { type: Number },
    focus_img: { type: String },
    link: { type: String },
    sort: { type: Number },
    status: { type: Number, default: 1 },
    add_time: {
        type: Number
    }
})

module.exports = mongoose.model('Focus', focusSchema, 'focus')