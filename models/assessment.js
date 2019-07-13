const mongoose =  require('mongoose');

const assessmentSchema = new mongoose.Schema({
    nurse: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    patient: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    immunization: String,
    lmp: String,
    presenthistory: String,
    pasthistory: String,
    nutrition: String,
    elimination: String,
    activity: String,
    sleep: String,
    communication: String,
    perception: String,
    socialstatus: String,
    sexuality: String,
    copingwithstress: String,
    values: String,
    others: String,
    valuesbrought: String,
    temp: String,
    height: Number,
    weight: Number,
    respiration: String,
    pulse: String,
    bloodpressure: String,
    urinalysis: String,
    general: String,
    palpitation: String,
    percussion: String,
    auscultation: String,
    labresult: String,
    nursingdiagnosis: String,
    status: {type: Boolean, default: true},
    created: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Assessment', assessmentSchema);