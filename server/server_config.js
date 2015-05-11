var db = require('./db/configMongoose');
var express = require('express');
var partials = require('express-partials');
var bodyParser = require('body-parser');
var multer  = require('multer');

var session = require('express-session');
var handlers = require('./libs/request-handlers');

var app = express();
//handles image uploads, stores them at the stat path (dest: )
app.use(multer({ dest: '../client/res/imgs/'}))

//set to json parsing for packet interpretation
//parsing handle behind the scenes, the information received will be on request.body
app.use(bodyParser.json());
//initial serving of client files
app.use(express.static(__dirname + '/../client'));

//sessions required for authentication
app.use(session({
  secret: 'be very quiet its a secret, WOOO!',
  resave: false, // session store needs touch method for this to be ok
  saveUninitialized : false
  //cookie: { secure : true} // requires https
}));

// get request, sends the clients all listings of pools in the db
app.get('/rentItems', handlers.getListings);

// returns the user information
app.get('/currentUser', handlers.getUser);

//get request for the sites icon (not done yet, stub in place)
app.get('/favicon.ico', handlers.stub);

//serves the index.html (front-end is single page application)
app.get('/login', handlers.serveIndex);

//serves the index.html (front-end is single page application)
app.get('/signup', handlers.serveIndex);

app.get('/userBookings', handlers.getBookings);

//handles all unhandle get request, used for serving index.html
//for the front end to handle refreshing correctly (front-end is single page application)
app.get('*', handlers.checkServeIndex);

//marks a listing as booked and saves the info in the db
app.post('/book', handlers.book);

//adds an item to the item collection (list a new pool into the listings)
app.post('/list', handlers.addItemToListings);

//mutler handles the saving of the image
//this request handler returns the path to where the image is stored
app.post('/uploadimg', handlers.uploadImage);

//signs up a new user if the username is not already taken
app.post('/signup', handlers.signUpUser);

//logins a user in if the name and password are valid.
app.post('/login', handlers.login);

module.exports = app;
