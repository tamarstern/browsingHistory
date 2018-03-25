// Load required packages
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var cors = require('cors');
var browsingHistoryController = require('./controllers/browsingHistory');

var config = require('config');

//db connection      
mongoose.connect(config.DBHost);
let db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
// Create our Express application
var app = express();

// Use the body-parser package in our application
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(cors({origin: '*'}))

// Create our Express router
var router = express.Router();

// Create endpoint handlers for /browsingHistorys
router.route('/browsingHistorys')
  .post(browsingHistoryController.postBrowsingHistorys)
  .get(browsingHistoryController.getBrowsingHistorys);

// Create endpoint handlers for /browsingHistorys/:browsingHistory_id
router.route('/browsingHistorys/:browsingHistory_id')
  .get(browsingHistoryController.getBrowsingHistory)
// Register all our routes with /api
app.use('/api', router);

// Start the server
app.listen(3030);

module.exports = app; 