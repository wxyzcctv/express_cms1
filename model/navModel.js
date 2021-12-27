const mongoose = require('./core');

const navSchema = mongoose.Schema({
    title: { type: String },
    link: { type: String },
    status: { type: Number, default: 1 },
    position:{ type: Number},
    is_opennew:{ type: Number},
    sort:{ type: Number},
    add_time: {
        type: Number
    }
})

module.exports = mongoose.model('Nav', navSchema, 'nav')