var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

//define the schema of a user
var userSchema = mongoose.Schema({
    username : { type: String, required:  true, unique: true },
    password : { type:String, required: true}
    //info on user
    // - email
    // - firstName
    // - lastName
});

var User = mongoose.model('User', userSchema);


/*
 * @name comparaPassword Used for comparing attempted passwords with the stored hash
 * @param attemptedPassword {string} the attempted password
 * @param callback {function} allows the caller to handle the result of the compare in error or success
 */
User.prototype.comparePassword = function(attemptedPassword, callback) {
  bcrypt.compare(attemptedPassword, this.get('password'), function(err, isMatch) {
    if(err) { 
        console.log('error in password compare!');
        callback(err);
    }
    callback(null, isMatch);
  });
};

/*
 * @name userSchema.pre Hash the password of newly created user as its being saved to the database
 * @param next {function} function to invoke upon success of hashing password
 */
userSchema.pre('save', function(next) {
    var self = this;
    bcrypt.hash(this.password, null, null, function(err, hash) {
        if(err) {
            console.log('error in hashing!', err)
        } else {
            self.password = hash; //replace the password with the hashed result to save in the db
            console.log('hash success! ', self.password);
            next(); 
        }
    });
});

module.exports = User;