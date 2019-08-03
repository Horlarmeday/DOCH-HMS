const mongoose =  require('mongoose');

const donorSchema = new mongoose.Schema({
    creator: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    patient: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    name: String,
    age: String,
    sex: String,
    history: String,
    bloodtype: String,
    hivtest: String,
    hcvtest: String,
    hbsagtest: String,
    vdrltest: String,
    donornumber: String,
    phone: Number,
    status: {type: Boolean, default: true},
    
}, {timestamps: true});

module.exports = mongoose.model('Donor', donorSchema);