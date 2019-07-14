const mongoose =  require('mongoose');

const dischargeSchema = new mongoose.Schema({
    patient: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    nurse: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    thedate: Date,
    time: Date,
    comment: String,
    ward:String,
    transferto: String,
    created: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Discharge', dischargeSchema);