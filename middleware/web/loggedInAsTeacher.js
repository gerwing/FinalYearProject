/*
 * loggedInAsTeacher Middleware Web Version - Checks whether teacher is logged in, otherwise redirects to login page
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