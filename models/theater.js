const mongoose =  require('mongoose');

const theaterSchema = new mongoose.Schema({
    surgeon: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    patient: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    //Theater
    surgery: String,
    indications: String,
    anaesthesia: String,
    assistance: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
    scrubnurse:  {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    anesthetist: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    findings: String,
    procedure: String,
    order: String,
    created: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Theater', theaterSchema);