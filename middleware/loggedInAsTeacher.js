/*
 * loggedInAsTeacher Middleware - Checks wether teacher is logged in
 */

module.exports = function(req, res, next) {
    if(req.user) {
        if(req.user.isTeacher)
            return next();
        else
            res.redirect('/teacher/login');
    }
    else res.redirect('/teacher/login');
};