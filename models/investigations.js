const mongoose =  require('mongoose');

const investigationsSchema = new mongoose.Schema({
    creator: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    patient: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    imaging: {type: mongoose.Schema.Types.ObjectId, ref: "Imaging"},
    name: String,
    price: Number,
    result: String,
    status: {type: Boolean, default: false},
    created: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Investigations', investigationsSchema);