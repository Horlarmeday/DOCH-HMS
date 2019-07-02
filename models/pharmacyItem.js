const mongoose =  require('mongoose');
const deepPopulate = require('mongoose-deep-populate')(mongoose)

const pharmacyItemSchema = new mongoose.Schema({
    creator: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'},
    dispensehistory: [{ 
        type: mongoose.Schema.Types.ObjectId, ref: 'PharmDispense'
    }],
    itemDigit: Number,
    name: String,
    income: Number,
    sellprice: Number,
    received: {type: Date},
    description: String,
    price: Number,
    unit: String,
    quantity: Number,
    rquantity: {type:Number, default: 0},
    cost: Number,
    expiration: {type: Date},
    vendor: String,
    serialnum: Number,
    location: String,
    created: {type: Date, default: Date.now}
});
 
//Populates schema to any level
pharmacyItemSchema.plugin(deepPopulate)
module.exports = mongoose.model('PharmacyItem', pharmacyItemSchema);