const mongoose =  require('mongoose');


const immunizationSchema = new mongoose.Schema({
    doctor: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    creator: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    patient: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    name: String,
    dateofbirth: Date,
    placeofbirth: String,
    atbirth: [{
        birthweight: String,
        atBirth: String,
    }],
    at6weeks: [{
        birthweight: String,
        at6weeks: String,
    }],
    at10weeks: [{
        birthweight: String,
        at10weeks: String,
    }],
    at14weeks: [{
        birthweight: String,
        at14weeks: String,
    }],
    at6months: [{
        birthweight: String,
        at6months: String,
    }],
    at1year: [{
        birthweight: String,
        at1year: String,
    }],
    at9months: [{
        birthweight: String,
        at9months: String,
    }],
    at15months: [{
        birthweight: String,
        at15months: String,
    }],
    at2years: [{
        birthweight: String,
        at2years: String,
    }],
    // mothersname: String,
    // mothersphone: Number,
    address: String,
    created: {type: Date, default: Date.now}
});

//Populates schema to any level

module.exports = mongoose.model('Immunization', immunizationSchema);