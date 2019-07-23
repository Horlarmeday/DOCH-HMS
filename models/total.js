const mongoose =  require('mongoose');

const totalSchema = new mongoose.Schema({
    all: {type: Number, default: 0},
}, { timestamps: true });

module.exports = mongoose.model('Total', totalSchema);