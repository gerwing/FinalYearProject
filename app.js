
/**
 * Module dependencies.
 */

var express = require('express'),
    http = require('http'),
    path = require('path'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    app = express();

/** MongoDB Database Connection */
// connect to database with Mongoose
var dbUrl = 'mongodb://localhost/vote';
var db = mongoose.connect(dbUrl);

/** Passport Configuration */
require('./config/passport')(passport);

/** Express Configuration */
// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
//Start Middleware needed for Authentication
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.session({ secret: 'christmas hat' }));
app.use(passport.initialize());
app.use(passport.session());
//Stop Middleware needed for Authentication
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

/** API Routes */
var modules = require('./routes/modules')(app);
var lectures = require('./routes/lectures')(app);
var homework = require('./routes/homework')(app);
var users = require('./routes/users')(app);
var authentication = require('./routes/authentication')(app, passport);

/** Page Routes */
var pages = require('./routes/pages')(app);

/** Server Startup */
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
