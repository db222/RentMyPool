var mongoose = require('mongoose');
//specify the database to connect to
// and connect to it
mongoose.connect('mongodb://localhost/RentMyPoolDB');

var db = mongoose.connection;
//logging of success or failure
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
 console.log('Mongodb connection open');
});


module.exports = db;

