/*
 * SSLRedirect Middleware, used to redirect to https automatically in Openshift
 */

module.exports = function(req, res, next) {
    if (req.headers['x-forwarded-proto'] == 'http') {
        res.redirect('https://' + req.headers.host + req.path);
    } else {
        return next();
    }
};