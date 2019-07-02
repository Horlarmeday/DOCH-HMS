const mongoose =  require('mongoose');
const deepPopulate = require('mongoose-deep-populate')(mongoose)

const visitSchema = new mongoose.Schema({
    doctor: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    creator: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    patient: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    reason: String,
    visittype: String,
    admitted: {type: Boolean, default: false},
    status: {type: Boolean, default: false},
    admissiondate: {type: Date},
    dischargedate: {type: Date},
    created: {type: Date, default: Date.now}
});

//Populates schema to any level
visitSchema.plugin(deepPopulate)
module.exports = mongoose.model('Visit', visitSchema);