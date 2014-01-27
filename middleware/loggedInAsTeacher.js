/*
 * loggedInAsTeacher Middleware - Checks wether teacher is logged in
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