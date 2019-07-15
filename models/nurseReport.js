const mongoose =  require('mongoose');

const reportSchema = new mongoose.Schema({
    creator: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    patient: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    comment: String,
    observation: String,
    t: String,
    p: String,
    r: String,
    bp: String,
    initial: String,
    ward: String,
    input: String,
    output: String,
    status: {type: Boolean, default: false},
    created: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Report', reportSchema);