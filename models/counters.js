const mongoose =  require('mongoose');

const countersSchema = new mongoose.Schema({
    id: {type: String, default: 'itemid'},
    sequence_value: {type: Number, default: 0}
});

module.exports = mongoose.model('Counter', countersSchema);