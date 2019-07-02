const mongoose =  require('mongoose');

const testSchema = new mongoose.Schema({
    name: String,
    price: Number,
    lab: {type: mongoose.Schema.Types.ObjectId, ref: "Lab"},
    code: {type:Number, unique: true},
    status: {type: Boolean, default: true},
    created: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Test', testSchema);