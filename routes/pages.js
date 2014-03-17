/*
 * Pages routes serving Web App
 */

var sslredirect = require('../middleware/SSLRedirect');

module.exports = function(app) {

    //GET WEBAPP
    app.get('*', sslredirect, function(req, res){
        res.render('index');  //Render EJS Index from views folder
    });

};