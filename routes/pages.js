/*
 * Pages routes serving Web App
 */

module.exports = function(app) {

    //GET WEBAPP
    app.get('*', function(req, res){
        res.render('index');  //Render EJS Index from views folder
    });

};