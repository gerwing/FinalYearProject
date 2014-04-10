/**
 * Module dependencies.
 */
var express = require('express'),
    path = require('path'),
    mongoose = require('mongoose'),
    passport = require('passport'),
    app = express(),
    redis = require('redis'),
    RedisStore = require('connect-redis')(express),
    config = require('config').Server,
    folders = require('config').Folders,
    redisConfig = require('config').Redis,
    sessionConfig = require('config').Session;

/** MongoDB Database Connection */
// connect to database with Mongoose
var dbUrl = config.dbUrl + config.dbName;
var db = mongoose.connect(dbUrl);

/** Passport Configuration */
require('./config/passport')(passport);

/** Redis Session Store Configuration*/
var client = redis.createClient(redisConfig.port, redisConfig.host);
client.auth(redisConfig.password, function (err) { if (err) throw err; });
var store = new RedisStore({client:client});

/** Express Configuration */
// all environments
app.set('views', path.join(__dirname, folders.views));
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
//Start Middleware needed for Authentication
app.use(express.cookieParser());
app.use(express.bodyParser());
app.use(express.session({
    store: store,
    secret: sessionConfig.secret
})); //REDIS SESSION
app.use(passport.initialize());
app.use(passport.session());
//Stop Middleware needed for Authentication
app.use(express.static(path.join(__dirname, folders.app)));
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
var server = app.listen(config.port,config.host,function() {
    console.log('Express server listening on port ' + config.port);
});

/** SOCKET IO Lecture API and Configuration*/
var io = require('socket.io').listen(server);
require('./config/socketio')(io,store,passport);
