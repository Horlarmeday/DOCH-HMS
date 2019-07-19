const mongoose =  require('mongoose');


const immunizationSchema = new mongoose.Schema({
    doctor: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    creator: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    patient: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    name: String,
    dateofbirth: Date,
    birthweight: String,
    placeofbirth: String,
    // mothersname: String,
    // mothersphone: Number,
    address: String,
    atBirth: String,
    at6weeks: String,
    at10weeks: String,
    at14weeks: String,
    at6months: String,
    at9months: String,
    at1year: String,
    at15months: String,
    at2years: String,
    created: {type: Date, default: Date.now}
});

//Populates schema to any level

module.exports = mongoose.model('Immunization', immunizationSchema);