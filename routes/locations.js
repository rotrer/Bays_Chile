var express = require('express');
var router = express.Router();
var Location = require('../models/locations.js');


router.get('/', function(req, resRquest) {
	resRquest.setHeader('Content-Type', 'application/json');
	Location.find({}, function (err, locations) {
		// if (err) response = err;
		resRquest.end(JSON.stringify( locations ));
	});
	
});

module.exports = router;