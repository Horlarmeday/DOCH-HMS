const mongoose =  require('mongoose');

const serviceSchema = new mongoose.Schema({
    creator: {type:  mongoose.Schema.Types.ObjectId, ref: "User"},
    service: String,
    price: Number,
    status: {type: Boolean, default: true},
    created: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Service', serviceSchema);