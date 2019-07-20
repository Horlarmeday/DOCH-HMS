const mongoose =  require('mongoose');

const wardinventorySchema = new mongoose.Schema({
    creator: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    item: String,
    quantity: Number,
    consumed: Number,
    price: Number,
    comments: String,
    status: {type: Boolean, default: true},
    created: {type: Date, default: Date.now}
});

module.exports = mongoose.model('WardInventory', wardinventorySchema);