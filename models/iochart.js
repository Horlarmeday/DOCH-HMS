const mongoose =  require('mongoose');


const iochartSchema = new mongoose.Schema({
    creator: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    patient: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    //INTAKE
    oral: String,
    rectal: String,
    intraveneous: String,
    insulin: String,
    intotal: String,
    //Output
    urine: String,
    gastricContents: String,
    fistula: String,
    total: String,
    notes: String,
    status: {type: Boolean, default: false},
    created: {type: Date, default: Date.now}
});


module.exports = mongoose.model('Iochart', iochartSchema);