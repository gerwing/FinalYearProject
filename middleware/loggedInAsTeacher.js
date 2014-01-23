/*
 * loggedInAsTeacher Middleware - Checks wether teacher is logged in
 */

module.exports = function(req, res, next) {
    if(req.user.isTeacher) {
        return next();
    }
    else res.redirect('/'); //TODO change redirect location to correct one
};