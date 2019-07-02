const mongoose =  require('mongoose');

const paymentSchema = new mongoose.Schema({
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
    initiator: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
    type: String,
    amount: Number,
    status: {type: Boolean, default: false},
}, { timestamps: true });

module.exports = mongoose.model('Payment', paymentSchema);