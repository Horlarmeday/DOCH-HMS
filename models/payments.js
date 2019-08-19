const mongoose =  require('mongoose');

const paymentSchema = new mongoose.Schema({
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
    initiator: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
    services: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service"}],
    drugs: [{ type: mongoose.Schema.Types.ObjectId, ref: "PharmacyItem"}],
    lab: [{ type: mongoose.Schema.Types.ObjectId, ref: "labItem"}],
    type: String,
    amount: Number,
    comment: String,
    modeofpayment: String,
    status: {type: Boolean, default: false},
    paid: {type: Boolean, default: false},
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);