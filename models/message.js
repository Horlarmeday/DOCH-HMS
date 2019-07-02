const mongoose = require('mongoose');

const MessageSchema = new mongoose.Schema({
	owner: {type: mongoose.Schema.Types.ObjectId, ref: 'User'},
	content: String,
	created: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Message', MessageSchema);