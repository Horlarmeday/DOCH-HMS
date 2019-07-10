const mongoose =  require('mongoose');

const consentFormSchema = new mongoose.Schema({
    surgeon: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    patient: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    //consent form
    operation: String,
    doctorsign: String,
    doctorsigndate: Date,
    interpretersign: String,
    interpreterdate: Date,
    interpretername: String,
    nameofparent: String,
    guardianname: String,
    of: String,
    upon: String,
    guardiansign: String,
    guardianaddress: String,
    guardiandate: Date,
    theater: {type: mongoose.Schema.Types.ObjectId, ref: "Theater"},
    created: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Consentform', consentFormSchema);