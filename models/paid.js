const mongoose =  require('mongoose');

const paidSchema = new mongoose.Schema({
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
    drugs: { type: mongoose.Schema.Types.ObjectId, ref: "PharmacyItem"},
    labs: { type: mongoose.Schema.Types.ObjectId, ref: "Test"},
    price: Number,
    checked: {type: Boolean, default: false},
}, { timestamps: true });

module.exports = mongoose.model('Paid', paidSchema);