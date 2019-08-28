const mongoose =  require('mongoose');

const paidSchema = new mongoose.Schema({
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
    drugs: { type: mongoose.Schema.Types.ObjectId, ref: "PharmacyItem"},
    lab: { type: mongoose.Schema.Types.ObjectId, ref: "Test"},
    imaging: { type: mongoose.Schema.Types.ObjectId, ref: "Imaging"},
    price: Number,
    checked: {type: Boolean, default: false},
}, { timestamps: true });

module.exports = mongoose.model('Paid', paidSchema);