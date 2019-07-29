const mongoose =  require('mongoose');


const wardRoundSchema = new mongoose.Schema({
    doctor: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    creator: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    patient: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    wardround: String,
    created: {type: Date, default: Date.now}
});

//Populates schema to any level

module.exports = mongoose.model('WardRound', wardRoundSchema);