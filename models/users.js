//Reference:https://www.geeksforgeeks.org/login-form-using-node-js-and-mongodb/
//Modified by: Yash M
var mongoose = require("mongoose");
var passportLocalMongoose=require("passport-local-mongoose");

//Create a database model for users
var UserSchema=mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: String,
    Password: {
        type: String,
        required: true
     }
});

UserSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model("users", UserSchema);