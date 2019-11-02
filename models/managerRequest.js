const mongoose =  require('mongoose');

const managerRequestSchema = new mongoose.Schema({
    pharmitem: {type: mongoose.Schema.Types.ObjectId, ref: "PharmacyItem"},
    labitem: {type: mongoose.Schema.Types.ObjectId, ref: "labItem"},
    department: String,
    quantity: Number,
    unit: String,
    item: String,
    comment: String,
    leftover: Number,
    requestedby: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    granted: {type: Boolean, default: false},
    declined: {type: Boolean, default: false},
}, { timestamps: true });

module.exports = mongoose.model('ManagerRequest',  managerRequestSchema);