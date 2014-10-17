var express = require('express');
var router = express.Router();

// var mongoose = require('mongoose');

// mongoose.connect('mongodb://localhost/mareas');

// var kittySchema = mongoose.Schema({
// 	    name: String
// 	});

// kittySchema.methods.speak = function () {
//   var greeting = this.name
//     ? "Meow name is " + this.name
//     : "I don't have a name"
//   console.log(greeting);
// }



// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function callback () {
// 	// var Kitten = mongoose.model('Kitten', kittySchema);
// 	// var silence = new Kitten({ name: 'Silence' });


// 	var Kitten = mongoose.model('Kitten', kittySchema);

// 	var fluffy = new Kitten({ name: 'Fea' });
	
// 	fluffy.save(function (err, fluffy) {
// 	  if (err) return console.error(err);
// 	  // fluffy.speak();
// 	});
// 	// Kitten.find({ name: 'Melio' }, function (err, kittens) {
// 	//   if (err) return console.error(err);
// 	//   console.log(kittens)
// 	// });
// });

/* GET home page. */
router.get('/', function(req, res) {
  res.send('Hola');
  // res.send('index', { title: 'Express' });
});

module.exports = router;
