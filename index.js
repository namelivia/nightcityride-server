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

app.use(bodyParser.json());
app.use(methodOverride());
app.use(allowCrossDomain);

app.set('views', __dirname + '/tpl');
app.use(express.static(__dirname + '/public'));
app.set('view engine', 'pug');
app.engine('pug', require('pug').__express);
app.get('/', function(req, res){
	res.render('page');
});

routes = require('./routes/messages')(app);

var twit = new twitter({
	consumer_key: process.env.CONSUMER_KEY,
	consumer_secret: process.env.CONSUMER_SECRET,
	access_token_key: process.env.ACCESS_TOKEN_KEY,
	access_token_secret: process.env.ACCESS_TOKEN_SECRET
});

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true }).then(
	() => {
		console.log('Connected to Database');

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
			console.log('Noder server running on port '+port);
		});
	},
	err => {
		console.log('ERROR: connecting to Database. ' + err);
	}
);

