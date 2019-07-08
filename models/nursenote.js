const mongoose =  require('mongoose');

const nursenoteSchema = new mongoose.Schema({
    name: String,
    note: String,
    creator: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    patient: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    status: {type: Boolean, default: false},
    created: {type: Date, default: Date.now}
});

module.exports = mongoose.model('NurseNote', nursenoteSchema);