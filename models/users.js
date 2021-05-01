//Reference:https://www.geeksforgeeks.org/login-form-using-node-js-and-mongodb/
//Modified by: Yash M
var mongoose = require("mongoose");
//var passportLocalMongoose=require("passport-local-mongoose");
mongoose.set('bufferCommands', false);

//Create a database model for users
const UserSchema= new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    email: String,
    password: {
        type: String,
     }
});



//UserSchema.plugin(passportLocalMongoose);
const userCol = mongoose.model('User', UserSchema);

module.exports= userCol
//module.exports=mongoose.model("history", historySchema);