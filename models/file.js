const mongoose =  require('mongoose');

const fileSchema = new mongoose.Schema({
    patient: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    creator: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    name: [],
}, {timestamps: true});

module.exports = mongoose.model('File', fileSchema);