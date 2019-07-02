const mongoose =  require('mongoose');

const labSchema = new mongoose.Schema({
    doctor: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    patient: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    tests: [{type: mongoose.Schema.Types.ObjectId, ref: "Test"}],
    name: String,
    description: String,
    status: {type: Boolean, default: false},
    created: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Lab', labSchema);