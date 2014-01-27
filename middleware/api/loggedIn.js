/*
 * loggedIn Middleware API Version - Checks whether user is logged in, otherwise returns HTTP 401
 */

module.exports = function(req, res, next) {
    if(req.user) {
        return next();
    }
    else res.send('User not logged in', 401);
};