//written by juliann u, code modified from here: https://www.geeksforgeeks.org/login-form-using-node-js-and-mongodb/

var express = require("express"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    bodyParser = require("body-parser"),
    LocalStrategy = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    User = require("./models/user");

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.connect("mongodb://localhost/auth_demo_app");

var app = express();
app.set("view engine", "ejs");
//app.use(bodyParser.urlencoded({ extended: true})); might not need this

app.use(require("express-session")({
    secret: "This is a test",
    resave: false,
    saveUninitialized: false
}));

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

//secret page after login
app.get("/secret", isLoggedIn, function (req, res){
    res.render("secret");
});

//user signup
app.post("/register", function (req, res){
    var username = req.body.username
    var password = req.body.password
    User.register(new User({ username: username }),
        password, function(err, user) {
            if (err){
                console.log(err);
                return res.render("register");
            }

            passport.authenticate("local")(
                req, res, function () {
                    res.render("secret");
                });
        });
        });

//login form
app.get("/login", function (req, res) {
    res.render("login");
});

//handling user login
app.post("/login", passport.authenticate("local", {
    successRedirect: "/secret",
    failureRedirect: "/login"

}), function (req, res){
});

//handling user logout
app.get("/logout", function (req, res){
    req.logout();
    res.redirect("/");
});

function isLoggedIn(req, res, next){
    if (req.IsAuthenticated()) return next();
    res.redirect("/login");
}

var port = process.env.PORT || 3000;
app.listen(port, function () {
    console.log("Server has Started!");
});