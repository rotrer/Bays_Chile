"use strict";

var mongoose = require('mongoose'),
		Schema = mongoose.Schema;

var locationSchema = new Schema({
    name: String,
    slug: String
});
 
module.exports = mongoose.model('Locations', locationSchema);