const mongoose =  require('mongoose');

const drugSchema = new mongoose.Schema({
    code: {type: Number, unique: true},
    generic: String,
    druginfo:[
        { 
            generic: String,
            brandname: String,
            litre: String,
            drugname: String,
            price: Number,
        }
    ],
    status: {type: Boolean, default: true},
    created: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Drug', drugSchema);