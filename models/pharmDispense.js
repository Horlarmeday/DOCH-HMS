const mongoose =  require('mongoose');

const pharmDispenseSchema = new mongoose.Schema({
    creator: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'},
    name: String,
    quantity: Number,
    unit: String,
    rquantity: Number,
    dateReceived: {type: Date},
    expiry: {type: Date},
    dispenseTo: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Department'},
    receivedBy: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'},
    dateDispensed: {type: Date},
    created: {type: Date, default: Date.now}
});
 

module.exports = mongoose.model('PharmDispense', pharmDispenseSchema);