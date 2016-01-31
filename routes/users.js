var express     = require('express');
var passport    = require('passport');
var Account     = require('../models/account');
var router      = express.Router();
var bodyparser  = require('body-parser');

var json= bodyparser.json();

var path = require('path');



router.get('/', function(req,res,next){
    var fileName = path.resolve( __dirname + '/../public/main.html');

    res.sendFile(fileName, function (err) {
        if (err) {
            console.log(err);
            res.status(err.status).end();
        }
        else {
            console.log('Sent:', fileName);
        }
    });
});


/* GET home page. */
router.get('/hello', function(req, res, next) {
    return res.render('register', {
        info: 'You can register here.',
        foo: 'Dog owners have dogs.'
    });
});



router.get('/register', function(req, res) {
    res.render('register',{info: "", foo: ""});
});


router.post('/register', json, function(req, res) {
    Account.register(new Account({
        username: req.body.username
    }),  req.body.password, function(err, account){
        if (err) {
            return res.render('register', {
                info: 'Sorry, requested user name is not available',
                foo: ''
            });
        }
        passport.authenticate('local')(req, res, function(){
            res.redirect('/');
        });
    });
});


router.get('/login', function(req, res) {
    res.render( 'login', {} );
});


router.post('/login', passport.authenticate('local'), function(req, res){
    res.redirect('/');
});


router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});


router.get('/ping', function(req, res) {
    res.status(200).send('pong!');
});


module.exports = router;