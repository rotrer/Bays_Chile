//Libs
var express = require('express');
var http = require('http');
var async = require('async')
var parseString = require('xml2js').parseString;

//Router
var router = express.Router();

//Models
var Location = require('../models/locations.js');
var Tide = require('../models/tides.js');

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
	resRequest.end(JSON.stringify( [{}] ));
});

router.get('/populate', function(req, resRequest) {
	Location.find({}, function (err, locations) {
		if (err) response = err;

		var calls2 = [];
		// for (var i = 0; i < locations.length; i++) {
		locations.forEach(function(location){
			calls2.push(function(callback2) {

				var idLocation = location._id;
				var options = {
						hostname: "www.shoa.cl",
						path: '/mareas/' + location.slug + '.php'
				};

				var gsaReq = http.get(options, function (response) {
						var completeResponse = '';
						response.on('data', function (chunk) {
								completeResponse += chunk;
						});
						response.on('end', function() {
							var xmlClean = completeResponse.replace(/[\n\t\r]/g,""),
									xmlClean = xmlClean.replace("<marea>", ""),
									xmlClean = xmlClean.replace("</marea>", "");
							var bayInfo = {data : []};
							parseString(xmlClean, function (err, resultParse) {
								var calls = [];

								if (resultParse !== undefined) {
									resultParse.mareas.dia.forEach(function(tide){
										if( tide.length > 45 ) {
											var infoDay = tide.split(" ");
											var dateTide = infoDay[0].split("/");
											calls.push(function(callback) {
													Tide.where({ locations_id: idLocation, day: parseInt(dateTide[0]), months: parseInt(dateTide[1]), years: parseInt(dateTide[2]) }).count(function (err, count) {
														if (err)
																return callback(err);

														if (count === 0) {
															var	date = infoDay[0],
																	h1st = infoDay[1],
																	m1st = infoDay[2],
																	t1st = infoDay[3],
																	h2st = infoDay[4],
																	m2st = infoDay[5],
																	t2st = infoDay[6],
																	h3st = infoDay[7],
																	m3st = infoDay[8],
																	t3st = infoDay[9],										
																	h4st = '',
																	m4st = '',
																	t4st = '';

															//Si tiene todos los datos del dia
															if (infoDay.length > 10) {
																h4st = infoDay[10];
																m4st = infoDay[11];
																t4st = infoDay[12];
															}
															
															callback(null, {
																		locations_id: idLocation,
																		years: parseInt(dateTide[2]),
																		months: parseInt(dateTide[1]),
																		day: parseInt(dateTide[0]),
																		h1st: h1st,
																		m1st: m1st,
																		t1st: t1st,
																		h2st: h2st,
																		m2st: m2st,
																		t2st: t2st,
																		h3st: h3st,
																		m3st: m3st,
																		t3st: t3st,
																		h4st: h4st,
																		m4st: m4st,
																		t4st: t4st
																});
														} else {
															callback(null, "");
														}
													});
											});
										}
									});
								}
								
								async.parallel(calls, function(err, result) {
									if (err)
										return console.log(err);
									var cleanTides = result.clean("");

									if (cleanTides.length > 0) {
										var promise = Tide.create(cleanTides);
										promise.then(function (resultInsert) {
											callback2(null, location.name);
											// console.log(resultInsert);
										});
									} else {
										callback2(null, location.name + ", len 0");
									}
									
								});
							});
						});
				}).on('error', function (e) {
						// console.log('problem with request: ' + e.message);
						if (e)
							return callback2(e);
				});
			}); // END calls2.push(function(callback) {


		}); // END locations.forEach(function(location){

		async.parallel(calls2, function(err, result) {
			if (err)
				return console.log(err);

			// console.log("Result: ");
			// console.log(result);
		});
		// };///////////
	});

	
	resRequest.end('');
});

router.get('/:bay', function(req, resRequest){
	var bay = req.params.bay;

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

	Location.where({slug: bay}).findOne(function (err, locations) {
		if (err) response = err;
		if (locations !== null) {
			Tide.find({locations_id: locations._id}, '-_id years months day h1st m1st t1st h2st m2st t2st h3st m3st t3st h4st m4st t4st', function(err, tides){
				resRequest.end(JSON.stringify( tides ));
			}).sort({months: 1, day: 1});
		} else {
			resRequest.end(JSON.stringify( {'error': 'bay not found'} ));
		};
	});
});

router.get('/:bay/:year/:month', function(req, resRequest){
	var bay = req.params.bay;
	var month = req.params.month;
	var year = req.params.year;

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

	Location.where({slug: bay}).findOne(function (err, locations) {
		if (err) response = err;
		if (locations !== null) {
			Tide.find({locations_id: locations._id, years: year, months: month}, '-_id years months day h1st m1st t1st h2st m2st t2st h3st m3st t3st h4st m4st t4st', function(err, tides){
				resRequest.end(JSON.stringify( tides ));
			}).sort({day: 1});
		} else {
			resRequest.end(JSON.stringify( {'error': 'bay not found'} ));
		};
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