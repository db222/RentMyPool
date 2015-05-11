var utils = require('./utilities.js');
var Item = require('./../db/dbModels/itemModel.js');
var User = require('./../db/dbModels/userModel.js');
var url = require('url');

/*
 * @name stub Stub function for routes without handlers yet to be implemented or defined
 * @param req {object} information on the clients request
 * @param res {object} object used for responding to the client with
 */
exports.stub = function (req,res) {
  console.log('stub', req.url);
  res.status(204).send();
};

/*
 * @name getUser returns information in the user associated with the session
 * @param req {object} information on the clients request
 * @param res {object} object used for responding to the client with
 */
exports.getUser = function (req, res) {
  res.status(200).send(utils.getUser(req, res));
};

/*
 * @name getListings queries the database for all listings(pools/items) and sends it to the client
 * @param req {object} information on the clients request
 * @param res {object} object used for responding to the client with
 */
exports.getListings = function(req, res) {
  console.log('getListings', req.url);
  //verify the user is logged in
  utils.checkUser(req,res, function() {
      var query = url.parse(req.url).query;
      var date = req.query.date;
      var loc = req.query.loc;
      //query db for all items listed
      Item.find({}, function(err, items) {
          if(!err) {
            var resultItems = items.filter(function(item) {
              if (date && item.dateFrom && item.dateTo) {
                if (!utils.checkDateRange(item.dateFrom,item.dateTo,date)) return false;
              }
              if (loc && item.address.indexOf(loc) < 0) return false;
              if(!item.calendar) {
                return true;
              }
              return !item.calendar.hasOwnProperty(date);
            })
<<<<<<< HEAD
            console.log('sending items back! ',resultItems.length);
=======
            console.log('sending items back!');
            console.log(resultItems);
            //send all items to the client
>>>>>>> backend commented!
            res.status(200).send({results: resultItems});
          }
          else { //error in query
              console.log('error in retrieving listings', err);
              res.status(500).send({errorMessage: 'error in retrieving listings'});
          }
      })
  });
};

/*
 * @name book Will look for the item in the database and marked its available date
 *            as booked and store the user_id that wants to book it
 * @param req {object} information on the clients request
 * @param res {object} object used for responding to the client with
 */
exports.book = function(req, res) {
  var info = req.body;
  utils.checkUser(req, res, function() { //authenticate user
    if(info.date.length === 10) { // check if the data format is of the right length
      Item.findOne({_id : info._id}, function(err, pool) { // locate the item in the db
        if(!err) { // no error in query
          var user = req.session.user;

          pool.booker_id = user._id; // record the user booking the pool
          pool.calendar = pool.calendar || {};
          pool.calendar[info.date] = true; // mark the pool as booked on the date
          pool.markModified('calendar'); // marked modified for saving

          pool.save(function(err, pool) { //save the pool(item), update info
            if(err) { //error in saving to db
              console.log('error in saving in booking');
              res.status(500).send({errorMessage : 'error with saving booking'});
            }
            else { // success in booking send client confirmation of success
              res.status(302).send('Payment');
            }
          });
        }
        else { //error in querying db, possible fault info given for query
          console.log('error in query of db for booking');
          res.status(500).send({errorMessage: 'error in query of db for booking'});
        }
      })
    }
    else { // issue with date format
      console.log('date is fudged up!');
      res.status(400).send({errorMessage: 'error with date in booking!'});
    }
  });
};

/*
 * @name serveIndex Sends the client the index.html (front-end is single page app)
 * @param req {object} information on the clients request
 * @param res {object} object used for responding to the client with
 */
exports.serveIndex = function(req, res) {
  console.log('serveIndex', req.url);
  //define where to look
  var options = {
    root: __dirname + '/../../client',
  };
  //send the index.html, sendFile() will 
  res.sendFile('index.html', options, function (err) {
    if(err) {
      console.log('error in serving index.html', err);
    }
    else {
      console.log('serving those files! woo!');
    }
  });
};

/*
 * @name checkServeIndex authenticate user if valid send index.html
 * @param req {object} information on the clients request
 * @param res {object} object used for responding to the client with
 */
exports.checkServeIndex = function(req, res) {
  console.log('checkServeIndex', req.url)
  utils.checkUser(req, res, exports.serveIndex.bind(null, req, res));
};

/*
 * @name addItemToListings Given a new pool to list the function adds that pool
                           to the database in the Item collection
 * @param req {object} information on the clients request
 * @param res {object} object used for responding to the client with
 */
exports.addItemToListings = function(req, res) {
  console.log('addItemToListings');
  utils.checkUser(req, res, function() { //validate/authenticate user
    var itemInfo = req.body;
    //define the model with the inforamtion of the pool sent by the client
    var newPool = new Item({ 
      name : itemInfo.name, 
      address : itemInfo.address,
      price : itemInfo.price,
      dateFrom : itemInfo.dateFrom,
      dateTo: itemInfo.dateTo,
      user_id: itemInfo.user_id,
      img: itemInfo.file
    });
    newPool.save(function(err) { // save the new pool(item) to the datebase
      if(err) { //error in saving to the database
        console.log('error in saving new listing', err);
        res.status(500).send({errorMessage : 'error in saving new listing' });
      }
      else { // success let the client know the listing was successful!
        console.log('added item to listings');
        res.status(201).send({successMessage : 'you posted to the database'});
      }
    })
  });
};

/*
 * @name uploadImage Returns the path to where the image is stored, by mutler
 *                   the path (../client/res/imgs/      set in server_config.js)
 * @param req {object} information on the clients request
 * @param res {object} object used for responding to the client with
 */
exports.uploadImage = function(req, res) {
  console.log('uploadImage', req.url);
  utils.checkUser(req,res,function() {
    console.log('Uploading');
    var path = req.files.file.path;
    res.status(201).send(req.files.file.path.substring(9)); //client/resource/images
  });
};

/*
 * @name signUpUser Checks if the new username is unique to our db, if so saves
 *                  the information to the db, creates a session and sends the 
 *                  client a redirect to the home page.
 *                  If not successful redirect back to sign up
 * @param req {object} information on the clients request
 * @param res {object} object used for responding to the client with
 */
exports.signUpUser = function(req, res) {
  console.log('signUpUser', req.url);
  var info = req.body;
  User.findOne({ username : info.username }, function(err, user) { //query for the username 
    if(err) {
      console.log('error in checking database in sign up', err);
      res.status(500).send({errorMessage: 'error in searching database upon signup'});
    }
    else if( ! user ) { //username does not exist, we can sign up a new user with this information
      var newUser = new User({
        username : info.username,
        password : info.password
      });

      newUser.save(function(err, newUser) { //save the new user
        if(err) { // error in saving the new user
          console.log('error in saving new user information to db');
          res.status(500).send({errorMessage: 'error in saving user info to Database'});
        } 
        else { //success in creating a new user
          utils.createSession(req,res,user); // create a session
        }
      });
    }
    else { //not a unique username
      console.log('username is already taken!', user);
      res.status(302).send('Sign Up');
    }
  });
};

/*
 * @name login If the username and password are valid, logs the user in and creates a session
 *             Else redirects back to the login page
 * @param req {object} information on the clients request
 * @param res {object} object used for responding to the client with
 */
exports.login = function(req, res) {
  console.log('login', req.url)
  var info = req.body;
  User.findOne({username: info.username}, function(err, user) { //find the username
    if(err) {
      console.log('server issue in db query for login');
      res.status(500).send({errorMessage: 'error in search of db upon login'});
    } 
    else if(user) { //valid username
      user.comparePassword(info.password, function(err, match) { //check the password
        if(err) { // error in comparing the password
          console.log('error in comparison!', err);
          res.status(500).send({errorMessage:'error in comparison of password'});
        }
        else { // password was a match login/create a session
          if(match) {
            utils.createSession(req,res,user);
            console.log('successful login!');
          } 
          else { //invalid password
            console.log('password fail!');
            res.status(302).send('Login');
          }
        }
      });
    }
    else { //invalid username
      console.log('username does not exist')
      res.status(302).send('Login');
    }
  });
};

/*
 * @name getBookings returns the pools(item(s)) the user has booked associated by the session
 * @param req {object} information on the clients request
 * @param res {object} object used for responding to the client with
 */
exports.getBookings = function(req,res) {
  console.log('getBookings');
  var info = req.bod;
  var user = req.session.user;
  utils.checkUser(req, res, function() { //authenticate/validate the user
    Item.find({booker_id : user._id}, function (err, bookings) { // find the item(s) booked by the user
      if(err) { //error in query of db
        console.log('error in querying db for bookings', err);
        res.status(500).send({errorMessage: 'error in querying db for bookings'});
      }
      else { // success send the client the pools(item(s)) the user has booked!
        console.log('success in getting bookings');
        res.status(200).send({results: bookings});
      }
    });
  });
}
