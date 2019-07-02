const mongoose =  require('mongoose');
const deepPopulate = require('mongoose-deep-populate')(mongoose)

const appointmentSchema = new mongoose.Schema({
    doctor: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    creator: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    patient: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    department: String,
    uniqueid: String,
    problem: String,
    type: String,
    taken: {type: Boolean, default: false},
    status: {type: Boolean, default: false},
    appointmentdate: {type: Date},
    appointmenttime: {type: Date},
    created: {type: Date, default: Date.now}
});

//Populates schema to any level
appointmentSchema.plugin(deepPopulate)
module.exports = mongoose.model('Appointment', appointmentSchema);