"use strict";

var mongoose = require('mongoose'),
		Schema = mongoose.Schema;

// mongoose.connect('mongodb://localhost/mareas');
console.log(Locations);
var tideSchema = new Schema({
    // locations_id: ObjectId,
    // years_id: ObjectId,
    // months_id: ObjectId,
    day: Number,
    h1st: String,
    m1st: String,
    t1st: String,
    h2st: String,
    m2st: String,
    t2st: String,
    h3st: String,
    m3st: String,
    t3st: String,
    h4st: String,
    m4st: String,
    t4st: String
});
 
module.exports = mongoose.model('Tides', tideSchema);