const mongoose =  require('mongoose');
const deepPopulate = require('mongoose-deep-populate')(mongoose)

const pharmacyItemSchema = new mongoose.Schema({
    creator: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'},
    dispensehistory: [{ 
        type: mongoose.Schema.Types.ObjectId, ref: 'PharmDispense'
    }],
    checked: {type: Boolean, default: false},
    itemDigit: Number,
    name: String,
    productcode: String,
    shelf: String,
    voucher: String,
    batch: String,
    loss: String,
    balance: Number,
    remarks: String,
    income: Number,
    sellprice: Number,
    received: {type: Date},
    description: String,
    price: Number,
    unit: String,
    quantity: Number,
    rquantity: {type:Number},
    cost: Number,
    expiration: {type: Date},
    vendor: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'},
    serialnum: Number,
    location: String,
    created: {type: Date, default: Date.now}
});
 
//Populates schema to any level
pharmacyItemSchema.plugin(deepPopulate)
module.exports = mongoose.model('PharmacyItem', pharmacyItemSchema);