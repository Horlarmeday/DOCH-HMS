const User = require('../models/user');
const async = require('async')
const Consultation = require('../models/consultation')
const Message = require('../models/message')

module.exports = function(io) {

  io.on('connection', function(socket) {

    const user = socket.request.user;
    console.log(user.name);
    const orderId = socket.request.session.orderId;
    console.log(orderId);

    //socket joining the chat thru orderId session
    socket.join(orderId);

    socket.on('chatTo', (data)=>{
    	async.waterfall([
    		function(callback){
    			//Sending the message to the front-end
    			io.in(orderId).emit('incomingChat', {
    				message: data.message, sender: user.name, senderImage: user.photo, senderId: user._id
    			})
    			var message = new Message();
    			message.owner = user._id;
    			message.content = data.message;
    			message.save(function(err){
    				callback(err, message)
    			})
    		},

    		function(message, callback){
    			//Saving chat to database
    			Order.update(
	    			{
	    				_id: orderId
	    			},
	    			{
	    				$push: {messages: message._id}
	    			},
	    			function(err, count){
	    				console.log(count)
	    			}
    			)
    		}

    	])
    })


  });
}
