var express     = require('express');
var passport    = require('passport');
var User        = require('../models/user');
var router      = express.Router();
var bodyparser  = require('body-parser');

/* GET home page. */
//router.get('/', function(req, res, next) {
//    res.render('index', { title: 'Express', user: req.user });
//});

var path = require('path');

router.get('/register', function(req, res) {
    res.sendFile(path.resolve('views/register.html'));
});

router.post('/register', function(req, res) {

    console.log(req.body.username, ' is username');

    //User.register(new Account({
    //    username: req.body.username
    //}),  req.body.password, function(err, account){
    //    if (err) {
    //        res.sendFile(path.resolve('views/error.html'));
    //    }
    //
    //    passport.authenticate('local')(req, res, function(){
    //        res.redirect('/dogs');
    //    });
    //});

});


router.get('/login', function(req, res) {
    res.sendFile(path.resolve('views/login.html'));
});


router.post('/login', passport.authenticate('local'), function(req, res){
    res.redirect('/dogs');
});


router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/dogs');
});


router.get('/ping', function(req, res) {
    res.status(200).send('pong!');
});


module.exports = router;