const mongoose =  require('mongoose');

const theaterSchema = new mongoose.Schema({
    surgeon: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    patient: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    surgery: String,
    indications: String,
    anaesthesia: String,
    anaesthetist: String,
    assistance: String,
    findings: String,
    procedure: String,
    order: String,
    created: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Theater', theaterSchema);