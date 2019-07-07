const mongoose =  require('mongoose');

const paymentSchema = new mongoose.Schema({
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
    initiator: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
    services: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service"}],
    type: String,
    amount: Number,
    comment: String,
    modeofpayment: String,
    status: {type: Boolean, default: false},
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);