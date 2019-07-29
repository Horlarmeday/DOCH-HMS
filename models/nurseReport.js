const mongoose =  require('mongoose');

const reportSchema = new mongoose.Schema({
    creator: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    patient: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    doctor: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    comment: String,
    observation: String,
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
    ward: String,
    status: {type: Boolean, default: false},
    created: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Report', reportSchema);