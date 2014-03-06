#!/bin/env node
//Get the environment variables we need.
var ipaddr  = process.env.OPENSHIFT_NODEJS_IP || "127.0.0.1";
var port    = process.env.OPENSHIFT_NODEJS_PORT || 3000;
var dbName =  "vote";

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
var dbUrl = 'mongodb://localhost:27017/' + dbName; //Default location
//take advantage of openshift env vars when available:
if(process.env.OPENSHIFT_MONGODB_DB_URL){
    var dbUrl = process.env.OPENSHIFT_MONGODB_DB_URL + dbName;
}
var db = mongoose.connect(dbUrl);

/** Passport Configuration */
require('./config/passport')(passport);

/** Express Configuration */
// all environments
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
app.use(express.static(path.join(__dirname, 'public')));
app.use(app.router);

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
var server = app.listen(port,ipaddr,function() {
    console.log('Express server listening on port ' + port);
});

/** SOCKET IO Lecture API and Configuration*/
var io = require('socket.io').listen(server);
require('./config/socketio')(io);
