//written by juliann u & yash mhaske, code modified from here: https://www.geeksforgeeks.org/login-form-using-node-js-and-mongodb/


var express = require("express"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
   
    UserInfo = require("./models/users");
    history = require("./models/users");
    http = require("http");
var ObjectID = require('mongodb').ObjectID;
let dbManager = require("./database/dbManager");
const User = require("./models/users");
const userCol = require("./models/userInfo");
const historyCol = require("./models/history");

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('bufferCommands', false);
//mongoose.connect("mongodb://localhost/auth_demo_app");

var app = express();
app.set("view engine", "ejs");

app.use(require("express-session")({
    secret: "This is a test",
    resave: false,
    saveUninitialized: false
}));

//For gif display on homepage
app.use(express.static("public"));

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//ROUTES
//BELOW

//homepage
app.get("/", function (req, res){
    res.render("home");
});

//User page after login
app.get("/userInfo", isLoggedIn, async function (req, res){
    //let users = dbManager.get().collection("users");

    try{
        let user = await User.findOne({_id: ObjectId(req.params.userID)});
        console.log(user);

    } catch(err) {
        console.log(err.message);
    }

    res.render("userInfo");
});

app.get("/register", function(req, res){
    res.render("register");
})

//user signup
app.post("/register", function (req, res){
    var username = req.body.username;
    var email = req.body.email;
    var password = req.body.password
    User.register(new User({ username: username, email: email}),
        password, function(err, user) {
            if (err){
                console.log(err);
                res.render("register");
            }

            passport.authenticate("local")(
                req, res, function () {
                    res.redirect("login");
                });
        });
        });

//login form
app.get("/login", function (req, res) {
    res.render("login");
});

//handling user login
app.post("/login", passport.authenticate("local", {
    successRedirect: "/userInfo",
    failureRedirect: "/login"

}), function (req, res){
});

//handling user logout
app.get("/logout", function (req, res){
    req.logout();
    res.redirect("/");
});

function isLoggedIn(req, res, next){
    if (req.isAuthenticated()) return next();
    res.redirect("/login");
}


app.listen(3000, async ()=>{
    try{
        await mongoose.connect('mongodb://localhost:27017/projectDB', {useNewUrlParser: true, useUnifiedTopology: true})
    } catch(e){
        console.log(e.message);
    }
    console.log("Server is fine and running");
});
