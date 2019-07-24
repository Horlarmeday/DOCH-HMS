const mongoose =  require('mongoose');
const deepPopulate = require('mongoose-deep-populate')(mongoose)

const supplySchema = new mongoose.Schema({
    creator: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'User'},
    itemDigit: Number,
    name: String,
    received: {type: Date},
    description: String,
    price: Number,
    unit: String,
    quantity: Number,
    rquantity: {type:Number},
    cost: Number,
    expiration: {type: Date},
    serialnum: Number,
    created: {type: Date, default: Date.now}
});
 
//Populates schema to any level
supplySchema.plugin(deepPopulate)
module.exports = mongoose.model('Supply', supplySchema);