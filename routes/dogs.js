var express     = require('express');
var passport    = require('passport');
var Dog         = require('../models/dog');
var router      = express.Router();
var bodyparser = require('body-parser');

router.use(bodyparser.json() );

//top level response
router.get('/', function(req, res) {
    console.log ('root .....')
    res.send('Welcome to Dog City Now');
});


//POST create a new object (should return newly created object that has db id to client)

router.post('/api/', function(req, res) {
    if (req.body.name !== null) {
        console.log(' incoming to server req.body is: ', req.body);
        var dog = new Dog(req.body);
        dog.save(function(err){
            if (err){ console.log('cannot do this');
                next(err);
            } else {
                res.status(201).json( dog );
            }
        });
    }
});


//GET - returns list of all objects
//query parameters define page size and zero based page number
router.get('/api', function(req,res,next){
    var page = req.query.page;  //zero based
    var pageSize = req.query.pageSize;

    Dog.find({})
        .sort({created: 'descending'})
        .limit(pageSize)
        .skip(pageSize * page)
        .exec(function (err, dogs) {
            if (err) {
                return next(err)
            }
            else {
                res.status(201).json(dogs);
            }
        })
});


//GET/:id - returns the object specified by that id
router.get('/api/:name', function(req,res,next){
    res.type('json');
    var name = req.params.name;
    Dog.
    findOne({
        name: name
    }).
    select ('name').select('breed').select('toys').
    exec(function(err, dog){
        console.log('you got back : ', dog);
        if (err)
        {return next(err)}
        else{
            res.status(201).json( dog );
        }
    })
});


//PUT/:id updates whole object with all provided data providers
router.put('/api/:id', function (req, res) {
    if ( req.params.id !== null ){
        Dog.
        findById( req.params.id, function(err,dog) {
            if (err) {res.send(err);}
            else {
                dog.name        = req.body.name;
                dog.breed       = req.body.breed;
                dog.toys    = req.body.toys;

                dog.save(req.params.id, function(err){
                    if (err) {
                        res.send(err);
                    }
                    else {
                        res.json(dog);
                    }
                });
            }
        });
    };
});


////PATCH does not work
//router.patch('/dogs/:id', function(req,res){
//    if (req.params.id !== null ){
//        User.
//        findByID (req.params.id , function (err, user){
//            if (err){res.send(err);
//            }
//            else {
//                res.json({message: " patch update completed "});
//            }
//        });
//    };
//});


//DELETE/:id delete the object specified by that id
router.delete('/api/:id', function (req, res) {
    if (req.params.id !== null){
        //console.log('OOO>>>', req.params.id);
        Dog.
        findByIdAndRemove( req.params.id, function(err,dog) {
            if (err){
                res.send(err);
            } else {
                res.json({
                    message: 'Record has been deleted.',
                    name:  dog.name,
                    id : dog._id
                });
            }
        });
    }
});

module.exports = router;