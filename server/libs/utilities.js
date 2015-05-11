var session = require('express-session');

/*
 * @name isLoggedIn identifies if there is an active session with a user
 * @param request {object} information on the clients request
 */
exports.isLoggedIn = function(request) {
    console.log(request.session.user)
    if(request.session) {
        return !!request.session.user;
    }
    return false
};

/*
 * @name getUser Returns the user (user information) associated with the session of the request
 * @param request {object} information on the clients request
 * @param response {object} object used for responding to the client with
 */
exports.getUser = function (request, response) {
    if(request.session)
        return request.session.user;
    else
        return null;
};

/*
 * @name checkUser checks if a session exists and user associated with it (authitcate a user logged in)
 * @param request {object} information on the clients request
 * @param response {object} object used for responding to the client with
 * @param next callback to invoke if the a session/logged-in-user exists
 */
exports.checkUser =  function(request, response, next) {
    console.log('checking user');
    if(!exports.isLoggedIn(request) && request.url.toLowerCase() !== "/home") {
        console.log('not logged in! redirect');
        response.redirect("/Home")
    } 
    else {
        console.log('check user callback time! (user/sess valid!)')
        next();
    }
}

/*
 * @name createSession Creates the session object on the request object used for authentication
 * @param request {object} information on the clients request
 * @param response {object} object used for responding to the client with
 * @param user {object} information representing the current user associated with the request
 */
exports.createSession = function(request, response, user) {
    console.log('createSession');
    return request.session.regenerate(function(err) {
        if(err) {
            console.log('error in creating a session', err);
            throw err;
        }
        request.session.user = user;
        console.log('created that session, redirect to home');
        response.status(201).send(user);
    });
}