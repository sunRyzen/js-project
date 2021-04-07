var mongoose = require("mongoose");
var passportLocalMongoose=require("passport-local-mongoose");

//Create a database model for users
var UserSchema=mongoose.Schema({
    username: String,
    Password: String
});

UserSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model("users", UserSchema);