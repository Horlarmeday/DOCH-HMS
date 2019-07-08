const mongoose =  require('mongoose');

const treatmentSchema = new mongoose.Schema({
    treatmenttype: String,
    description: String,
    creator: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    patient: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    status: {type: Boolean, default: false},
    created: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Treatment', treatmentSchema);