// Load required packages
var mongoose = require('mongoose');

// Define our beer schema
var BrowserHistorySchema   = new mongoose.Schema({
  url: String,
  time: Date,
  referrer: {type: String, default: 'EMPTY_REFERRER'},
  iframes:[String],
  userId: String
});

// Export the Mongoose model
module.exports = mongoose.model('BrowserHistory', BrowserHistorySchema);