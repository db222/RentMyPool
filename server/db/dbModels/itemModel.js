var mongoose = require('mongoose');


var itemSchema = mongoose.Schema({
  name: {type: String, required: true},
  address: {type: String, required: true},
  price: {type: Number, required: true},
  images: [],
  calendar: {},
  rules: [],
  date: "",
  user_id: {type: String, required: true}
});

var Item = mongoose.model('Item', itemSchema );

module.exports = Item;
