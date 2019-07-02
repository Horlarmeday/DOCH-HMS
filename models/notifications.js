const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const NotificationsSchema = new Schema({
  recepient: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
  action: String,
  content: String,
  sender: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
  payment: {type: mongoose.Schema.Types.ObjectId, ref: "Payment"},
  appointment: {type: mongoose.Schema.Types.ObjectId, ref: "Appointment"},
  read: {type:Boolean, default: false},
});

module.exports = mongoose.model('Notifications', NotificationsSchema);