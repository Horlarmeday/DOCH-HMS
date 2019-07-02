const mongoose =  require('mongoose');

const imagingSchema = new mongoose.Schema({
    doctor: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    patient: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    name: String,
    description: String,
    price: Number,
    result: String,
    status: {type: Boolean, default: false},
    created: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Imaging', imagingSchema);