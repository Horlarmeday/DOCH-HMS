const mongoose =  require('mongoose');
const deepPopulate = require('mongoose-deep-populate')(mongoose)

const localInventorySchema = new mongoose.Schema({
    creator: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'},
    name: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'PharmacyItem'},
    productcode: String,
    shelf: String,
    shelfno: String,
    balance: Number,
    comment: String,
    received: {type: Date},
    price: Number,
    unit: String,
    quantity: Number,
    cost: Number,
    expiration: {type: Date},
    consumed: String,
    created: {type: Date, default: Date.now}
});
 
//Populates schema to any level
localInventorySchema.plugin(deepPopulate)
module.exports = mongoose.model('LocalInventory', localInventorySchema);