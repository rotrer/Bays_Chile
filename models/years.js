"use strict";

var mongoose = require('mongoose'),
		Schema = mongoose.Schema;

// mongoose.connect('mongodb://localhost/mareas');

var yearSchema = new Schema({
    year: Number
});
 
module.exports = mongoose.model('Years', yearSchema);