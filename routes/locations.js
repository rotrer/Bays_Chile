//Libs
var express = require('express');
var http = require('http');
var async = require('async')
var parseString = require('xml2js').parseString;

//Router
var router = express.Router();

//Models
var Location = require('../models/locations.js');


router.get('/', function(req, resRequest) {
	// // Website you wish to allow to connect
	resRequest.setHeader('Access-Control-Allow-Origin', '*');
	// Request methods you wish to allow
	resRequest.setHeader('Access-Control-Allow-Methods', 'GET');
	// Request headers you wish to allow
	resRequest.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	// Set to true if you need the website to include cookies in the requests sent
	// to the API (e.g. in case you use sessions)
	resRequest.setHeader('Access-Control-Allow-Credentials', true);
	resRequest.setHeader('Content-Type', 'application/json');

	Location.find({}, 'name slug -_id', {sort: {name: 1}}, function (err, locations) {
		// if (err) response = err;
		resRequest.end(JSON.stringify( locations ));
	});
});

router.get('/populate', function(req, resRequest) {
	var locationsToSave = [ { "name" : "Puerto Williams", "slug" : "williams" },
													{ "name" : "Ancud", "slug" : "ancud" },
													{ "name" : "Valparaíso", "slug" : "valparaiso" },
													{ "name" : "Angostura", "slug" : "angostura" },
													{ "name" : "Antofagasta", "slug" : "antofagasta" },
													{ "name" : "Arica", "slug" : "arica" },
													{ "name" : "Caldera", "slug" : "caldera" },
													{ "name" : "Coquimbo", "slug" : "coquimbo" },
													{ "name" : "Corral", "slug" : "corral" },
													{ "name" : "Iquique", "slug" : "iquique" },
													{ "name" : "Puerto Chacao", "slug" : "chacao" },
													{ "name" : "Puerto Montt", "slug" : "montt" },
													{ "name" : "Puerto Natales", "slug" : "natales" },
													{ "name" : "Puerto Arenas", "slug" : "arenas" },
													{ "name" : "San Antonio", "slug" : "sanantonio" },
													{ "name" : "Talcahuano", "slug" : "talcahuano" }];
	var calls = [];

	locationsToSave.forEach(function(localidad){
		calls.push(function(callback) {
				Location.where({ slug: localidad.slug }).count(function (err, count) {
					if (err)
							return callback(err);

					if (count === 0) {
						callback(null, {
														name: localidad.name,
														slug: localidad.slug
												});
					} else {
						callback(null, "");
					}
				});
		});
	});

	async.parallel(calls, function(err, result) {
		if (err)
			return console.log(err);

		var cleanLocations = result.clean("");

		if (cleanLocations.length > 0) {
			var promise = Location.create(cleanLocations);
			promise.then(function (resultInsert) {
			});
			resRequest.end('OK');
		} else {
			resRequest.end('FAIL');
		}
	});
});

module.exports = router;

Array.prototype.clean = function(deleteValue) {
	for (var i = 0; i < this.length; i++) {
		if (this[i] == deleteValue) {         
			this.splice(i, 1);
			i--;
		}
	}
	return this;
};