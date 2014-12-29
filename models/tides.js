"use strict";

var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var tideSchema = new Schema({
    keyday: String,
    locations_id: { type: Schema.Types.ObjectId, ref: 'Location' },
    years: Number,
    months: Number,
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