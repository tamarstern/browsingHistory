// Load required packages
var BrowsingHistory = require('../models/browsingHistory');

// Create endpoint /api/browsingHistorys for POSTS
exports.postBrowsingHistorys = function(req, res) {
  // Create a new instance of the BrowsingHistory model
  var browsingHistory = new BrowsingHistory();

  // Set the browsingHistory properties that came from the POST data
  browsingHistory.url = req.body.url;
  if(req.body.referrer) {
    browsingHistory.referrer = req.body.referrer;
  }
  var millis = parseInt(req.body.time);
  browsingHistory.time = new Date(millis);

  // Save the browsingHistory and check for errors
  browsingHistory.save(function(err) {
    if (err) {
        return res.send(err);
    }
    return res.json({ message: 'BrowsingHistory added!', data: browsingHistory });
  });
};

// Create endpoint /api/browsingHistorys for GET
exports.getBrowsingHistorys = function(req, res) {
  // Use the BrowsingHistory model to find all browsingHistory
  BrowsingHistory.find({}).sort({time: -1}).exec(function(err, browsingHistorys) {
    if (err) {
      return res.send(err);
    }
    return res.json(browsingHistorys);
  });
};

// Create endpoint /api/browsingHistorys/:browsingHistory_id for GET
exports.getBrowsingHistory = function(req, res) {
  // Use the BrowsingHistory model to find a specific browsingHistory
  BrowsingHistory.findById(req.params.browsingHistory_id, function(err, browsingHistory) {
    if (err) {
      return res.send(err);
    }
    return res.json(browsingHistory);
  });
};
