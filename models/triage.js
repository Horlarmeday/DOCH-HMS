const mongoose =  require('mongoose');

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
    muac: String,
    taken: {type: Boolean, default: false},
    seen: {type: Boolean, default: false},
    created: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Triage', triageSchema);