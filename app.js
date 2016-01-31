var express 	= require('express');
var fs 		    = require('fs');
var path 		= require("path");
var session     = require('express-session');
var mongoose    = require('mongoose');
var logger      = require('morgan');
var cookieParser= require('cookie-parser');

var passport    = require('passport');
var LocalStrategy= require('passport-local').Strategy;

var dogs        = require('./routes/dogs');
var users       = require('./routes/users');

var app = express();

var bodyParser  = require('body-parser');

const methodOverride = require( 'method-override' );

var debug = require('debug')('app');
debug( 'this is app' );

 //view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');


app.use(express.static(__dirname + '/public'));


// uncomment after placing your favicon in /public
// app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(logger('dev'));
app.use(bodyParser.json() );
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    secret: 'urim-v-tumim',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/login');
}


var Account = require('./models/account');

passport.use(new LocalStrategy( Account.authenticate() ) );
passport.serializeUser(Account.serializeUser() );
passport.deserializeUser(Account.deserializeUser() );

app.use('/', users);
app.use('/api/dogs', ensureAuthenticated, dogs);

console.log('getting conection string in app <<<<<<<<<');

try {var uristring = require('./data/mongolabinfo.js').loginstring;}
catch(err){console.log('mongolab connection error')}

console.log(uristring, ': is uri >>>>>>>>>');
mongoose.connect(uristring);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});



module.exports = app;