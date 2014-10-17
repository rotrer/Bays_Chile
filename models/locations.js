"use strict";

var mongoose = require('mongoose'),
		Schema = mongoose.Schema;

mongoose.connect('mongodb://localhost/mareas');

var locationSchema = new Schema({
    name: String,
    slug: String
});
 
module.exports = mongoose.model('Locations', locationSchema);