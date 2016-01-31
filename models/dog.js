var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Dog = new Schema ({
    name                :  String,
    breed               :  String,
    toys                :  String
});


//Account.plugin(passportLocalMongoose);

module.exports = mongoose.model('Dog', Dog);