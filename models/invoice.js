const mongoose =  require('mongoose');

const invoiceSchema = new mongoose.Schema({
    consultation: {type: mongoose.Schema.Types.ObjectId, ref: "Consultation"},
    name: String,
    code: String,
    status: {type: Boolean, default: false},
    created: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Invoice', invoiceSchema);