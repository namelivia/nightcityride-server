//File: routes/messages.js
module.exports = function(app) {

	var Message = require('../models/messages.js');

	//GET - Return the latest message in the DB
	findAllMessages = function(req, res) {
		Message.find().sort({$natural:-1}).limit(30).exec(function(err, messages) {
			if(!err) {
				res.send(messages);
			} else {
				console.log('ERROR: ' + err);
			}
		});
	};

	//GET - Return if the are new messages
	anyNewMessages = function(req, res) {
		if (Message.newMessages){
			res.send('1');
			Message.newMessages = false;
		} else {
			res.send('0');
		}
	};

	//Link routes and functions
	app.get('/messages', findAllMessages);
	app.get('/newmessages', anyNewMessages);
}
