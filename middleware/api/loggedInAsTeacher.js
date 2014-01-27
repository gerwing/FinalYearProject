/*
 * loggedInAsTeacher Middleware API Version - Checks whether teacher is logged in, otherwise returns HTTP 401
 */

module.exports = function(req, res, next) {
    if(req.user) {
        if(req.user.isTeacher)
            return next();
        else
            res.send('User is not a teacher', 401);
    }
    else res.send('User not logged in', 401);
};