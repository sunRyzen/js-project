//written by juliann u & yash mhaske, code modified from: Prof. Jacob Levy's APW Activity Server Lab
let express = require("express"),
    mongoose = require("mongoose"),
    //passport = require("passport"),
    //LocalStrategy = require("passport-local"),
    //passportLocalMongoose = require("passport-local-mongoose"),
    bodyParser = require('body-parser');
    http = require("http");
var ObjectID = require('mongodb').ObjectID;
let dbManager = require("./database/dbManager");

const historyCol = require("./models/history");

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('bufferCommands', false);
//mongoose.connect("mongodb://localhost/auth_demo_app");\

let app = express();
app.set("view engine", "ejs");

let session = require('express-session');
let crypto = require('crypto');
const userCol = require('./models/users');
function genHash(input){
    return Buffer.from(crypto.createHash('sha256').update(input).digest('base32')).toString('hex').toUpperCase();
}

function docifyUser(params){
    let doc = new userCol({_id: params.user, email: params.email, password: genHash(params.password)});
    return doc;
}

function docifyUserInfo(params){
    let doc = new userInfo({username: params.username, zipcode: params.zipcode, date: params.date, country: params.country});
    return doc;
}

app.use(session({
    secret: "This is a test",
    resave: false,
    saveUninitialized: false
}));

//For gif display on homepage
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

//app.use(passport.initialize());
//app.use(passport.session());

//passport.use(new LocalStrategy(User.authenticate()));
//passport.serializeUser(User.serializeUser());
//passport.deserializeUser(User.deserializeUser());

//ROUTES
//BELOW

//homepage
app.get("/", function (req, res){
    //Check if logged in
    if (!req.session.user){
        res.redirect('/login')
    } else {
        res.render('home', {trusted: req.session.user});
    }
});

//User page after login
app.get("/userInfo", async function (req, res){
    //let users = dbManager.get().collection("users");

    try{
        let user = await User.findOne({_id: req.params.username});
        console.log(user);

    } catch(err) {
        console.log(err.message);
    }

    res.render("userInfo");
});

app.get("/register", function(req, res){
    if (req.session.user){
        res.redirect('/');
    }
    res.render("register");
})

//user signup
app.post("/register", express.urlencoded({extended:false}), async (req, res, next)=>{
    if (req.body.password.toString() != req.body.confirm.toString()){
        res.render("register")
    }

    try{
        let newUser = {};
        newUser.user = req.body.user;
        newUser.email = req.body.email;
        newUser.password = req.body.password;

        await docifyUser(newUser).save();

        res.redirect("/login");
    } catch(err){
        next(err);
    }
})
//login form
app.get("/login", function (req, res) {
    if (req.session.user){
        res.redirect('/')
    } else {
        res.render("login");
    }
});

//handling user login
app.post("/login", express.urlencoded({extended:false}), async (req,res,next)=> {
    let untrusted = {user: req.body.userName, password: genHash(req.body.pass)};

    try{
        let result = await userCol.findOne({_id: req.body.userName});

        if (untrusted.password.toString().toUpperCase() == result.password.toString().toUpperCase()){
            let trusted = {name: result._id.toString()};
            req.session.user = trusted;
            res.redirect('/');
        } else {
            res.redirect('/login')
        }
    } catch (err) {
        next(err);
    }
});

//handling user logout
app.get("/logout", function (req, res){
    if (req.session.user){
        req.session.destroy();
    }
    res.redirect("/login");
});

//function isLoggedIn(req, res, next){
  //  if (req.isAuthenticated()) return next();
    //res.redirect("/login");
//}


app.listen(3000, async ()=>{
    try{
        await mongoose.connect('mongodb://localhost:27017/jsprojectDB', {useNewUrlParser: true, useUnifiedTopology: true})
    } catch(e){
        console.log(e.message);
    }
    console.log("Server is fine and running");
});
