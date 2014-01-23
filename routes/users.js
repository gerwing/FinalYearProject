/*
 * User routes
 */

module.exports = function(app) {

    //REGISTER TEACHER
    app.post('/teacher/register', function(req,res) {
        //Register Teacher
    });

    //UPDATE TEACHER
    app.put('/teacher/:id', function(req,res) {
        //Update Teacher Account
    });

    //DELETE TEACHER
    app.delete('/teacher/:id', function(req,res) {
        //Delete Teacher Account
    });

};