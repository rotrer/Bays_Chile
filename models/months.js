"use strict";

var mongoose = require('mongoose'),
		Schema = mongoose.Schema;

// mongoose.connect('mongodb://localhost/mareas');

var monthSchema = new Schema({
    month: Number
});
 
module.exports = mongoose.model('Months', monthSchema);