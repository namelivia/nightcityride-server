var express = require('express'),
    util = require('util'),
	twitter = require ('twitter'),
	mongoose = require('mongoose'),
	bodyParser = require('body-parser'),
	methodOverride = require('method-override'),
	Message = require('./models/messages.js'),
	app = express(),
	port = 60000,
	db;

//Middleware: Allow cross-domain requests (CORS)
var allowCrossDomain = function(req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type');
	 
	next();
}

app.use(bodyParser());
app.use(methodOverride());
app.use(allowCrossDomain);

app.set('views', __dirname + '/tpl');
app.use(express.static(__dirname + '/public'));
app.set('view engine', "jade");
app.engine('jade', require('jade').__express);
app.get("/", function(req, res){
    res.render("page");
});

routes = require('./routes/messages')(app);
mongoose.connect('mongodb://localhost/messages', function(err, res) {
	if(err) {
		console.log('ERROR: connecting to Database. ' + err);
	} else {
		console.log('Connected to Database');
	}
});

var twit = new twitter({
  consumer_key: '9QoU3iDvuqDXH53aj8pTgeft3',
  consumer_secret: 'JgGJGYwMw3zK9uEPxwb8ri4F1lQLvpoGwTQ4K5DegqYoGg7zoV',
  access_token_key: '204869812-1ezsldbngmfUcF2ffD6jLNsHCD5yLBGq8xuPCWPq',
  access_token_secret: 'xVzWvNd2cL6yv6JOBgLZQgozdOVQ2KBXKWTSnmLybIGJY' 
});

//Ve recogiendo los tweets
twit.stream('statuses/filter', {track:'#nightcityride'}, function(stream) {
    stream.on('data', function(data) {
		console.log(util.inspect(data.text));
		var message = new Message({
			content: util.inspect(data.text),
		});

		message.save(function(err) {
			if(!err) {
				console.log('Created');
				Message.newMessages = true;
			} else {
				console.log('ERROR: ' + err);
			}
		});
	});
});


app.listen(port, function(){
	console.log("Noder server running on port "+port);
});
