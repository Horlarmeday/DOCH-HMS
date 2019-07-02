const mongoose =  require('mongoose');

const invoiceSchema = new mongoose.Schema({
    name: String,
    status: {type: Boolean, default: false},
    created: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Invoice', invoiceSchema);