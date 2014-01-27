/*
 * loggedIn Middleware Web Version - Checks whether user is logged in, otherwise redirects to home page
 */

module.exports = function(req, res, next) {
    if(req.user) {
        return next();
    }
    else res.redirect('/');
};