const mongoose =  require('mongoose');

const careplanSchema = new mongoose.Schema({
    diagnosis: String,
    objective: String,
    action: String,
    scientificprinciple: String,
    evaluation: String,
    creator: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    patient: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    status: {type: Boolean, default: false},
    created: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Careplan', careplanSchema);