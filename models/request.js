const mongoose =  require('mongoose');
const deepPopulate = require('mongoose-deep-populate')(mongoose)

const requestSchema = new mongoose.Schema({
    pharmitem: {type: mongoose.Schema.Types.ObjectId, ref: "PharmacyItem"},
    labitem: {type: mongoose.Schema.Types.ObjectId, ref: "labItem"},
    department: String,
    quantity: Number,
    unit: String,
    item: String,
    comment: String,
    requestedby: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    granted: {type: Boolean, default: false},
    declined: {type: Boolean, default: false},
}, { timestamps: true });

//Populates schema to any level
requestSchema.plugin(deepPopulate)
module.exports = mongoose.model('Request', requestSchema);