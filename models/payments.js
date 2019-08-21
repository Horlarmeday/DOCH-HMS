const mongoose =  require('mongoose');
const deepPopulate = require('mongoose-deep-populate')(mongoose)

const paymentSchema = new mongoose.Schema({
    patient: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
    initiator: { type: mongoose.Schema.Types.ObjectId, ref: "User"},
    services: [{ type: mongoose.Schema.Types.ObjectId, ref: "Service"}],
    drugs: [{ type: mongoose.Schema.Types.ObjectId, ref: "PharmacyItem"}],
    lab: [{ type: mongoose.Schema.Types.ObjectId, ref: "Test"}],
    imaging: [{ type: mongoose.Schema.Types.ObjectId, ref: "Imaging"}],
    type: String,
    amount: Number,
    comment: String,
    modeofpayment: String,
    status: {type: Boolean, default: false},
    paid: {type: Boolean, default: false},
}, { timestamps: true });

//Populates schema to any level
paymentSchema.plugin(deepPopulate)
module.exports = mongoose.model('Payment', paymentSchema);