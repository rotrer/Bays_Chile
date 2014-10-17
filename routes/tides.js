var express = require('express');
var router = express.Router();
var Location = require('../models/locations.js');
var Year = require('../models/years.js');
var Month = require('../models/months.js');
var Tide = require('../models/tides.js');

router.get('/', function(req, resRquest) {
	resRquest.setHeader('Content-Type', 'application/json');
	// Location.find({}, function (err, locations) {
		// if (err) response = err;
		resRquest.end(JSON.stringify( locations ));
	// });
	
});

module.exports = router;