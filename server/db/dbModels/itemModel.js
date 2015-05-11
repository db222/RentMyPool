var mongoose = require('mongoose');

//define the schema for items
var itemSchema = mongoose.Schema({
  name: {type: String, required: true},
  address: {type: String, required: true}, //address of the pool
  price: {type: Number, required: true}, // price for the pool
  calendar: {}, //used for marking dates of availablitiy and booking
  rules: [], //not userd yet, intention for definning rule sets for availability of an item
  dateFrom: {type: String, required: true},
  dateTo: {type: String, required: true},
  user_id: {type: String, required: true}, // id of the user listing the pool
  img : {type: String, required: false}, //path to the image
  booker_id: { type: String } //recorded when some one books the pool(item), id of that user
});

//define the model/collection
var Item = mongoose.model('Item', itemSchema );

module.exports = Item;
