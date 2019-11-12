const mongoose =  require('mongoose');
const deepPopulate = require('mongoose-deep-populate')(mongoose)

const triageSchema = new mongoose.Schema({
    creator: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    patient: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    weight: Number,
    height: Number,
    bmi: Number,
    rvs: String,
    pulse: String,
    respiration: String,
    blood: String,
    temperature: String,
    heartrate: String,
    dystolic: String,
    systolic: String,
    fheartrate: String,
    spo2: String,
    muac: String,
    taken: {type: Boolean, default: false},
    seen: {type: Boolean, default: false},
    created: {type: Date, default: Date.now}
});
//Populates schema to any level
triageSchema.plugin(deepPopulate)
module.exports = mongoose.model('Triage', triageSchema);