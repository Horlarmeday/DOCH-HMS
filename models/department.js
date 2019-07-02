const mongoose =  require('mongoose');

const departmentSchema = new mongoose.Schema({
    name: String,
    description: String,
    status: {type: Boolean, default: false},
    created: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Department', departmentSchema);