const mongoose =  require('mongoose');

const vendorSchema = new mongoose.Schema({
    name: String,
    location: String,
    status: {type: Boolean, default: true},
    created: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Vendor', vendorSchema);