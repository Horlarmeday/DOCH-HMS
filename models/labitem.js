const mongoose =  require('mongoose');
const deepPopulate = require('mongoose-deep-populate')(mongoose)

const labItemSchema = new mongoose.Schema({
    creator: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'},
    dispensehistory: [{ 
        type: mongoose.Schema.Types.ObjectId, ref: 'LabDispense'
    }],
    itemDigit: Number,
    name: String,
    productcode: String,
    shelf: String,
    shelfno: String,
    voucher: String,
    batch: String,
    loss: String,
    balance: Number,
    remarks: String,
    received: {type: Date},
    description: String,
    price: Number,
    unit: String,
    quantity: Number,
    rquantity: {type:Number, default: 0},
    cost: Number,
    expiration: {type: Date},
    serialnum: Number,
    vendor: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'},
    created: {type: Date, default: Date.now}
});
 
//Populates schema to any level
labItemSchema.plugin(deepPopulate)
module.exports = mongoose.model('labItem', labItemSchema);