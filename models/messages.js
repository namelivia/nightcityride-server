var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var messageSchema = new Schema({
  content:    { type: String },
});

module.exports = mongoose.model('message', messageSchema);
var newMessages;
