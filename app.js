//written by juliann u & yash mhaske, code modified from: Prof. Jacob Levy's APW Activity Server Lab
let express = require("express"),
    mongoose = require("mongoose"),
    //passport = require("passport"),
    //LocalStrategy = require("passport-local"),
    //passportLocalMongoose = require("passport-local-mongoose"),
    bodyParser = require('body-parser');
    http = require("http");
var ObjectID = require('mongodb').ObjectID;
var qString = require("querystring");
let dbManager = require("./database/dbManager");
const axios = require('axios');
const btoa = require('btoa');

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

//API stuff
const weather_API_URL = 'https://api.openweathermap.org/data/2.5/weather?zip=';
const weather_API_KEY = '116b498b620ae1272a3f6b1d7c177f21';
const sky_API_URL = 'https://api.astronomyapi.com/api/v2';
const sky_API_KEY = '3206e5f7-04e2-4b0d-84d4-cb769bdb785a';
const sky_SECRET_KEY = '6ac5b2276b28bfab8f45b6f5f24612f52103960d443b52769a5e711b0c744e6955e51231842a4027c3828b4ecaca169a38e174e11a74c4bb3cbc77667b4aa5c06d6eaf33185d1aadc6f8d5c104a90516675b72224f1ceffa848172e696cd9f90b670e131a0ddb59058b233574f3d8ae3';
const hash = btoa(`${sky_API_KEY}:${sky_SECRET_KEY}`);

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
//app.use(bodyParser.urlencoded({ extended: true }));

//app.use(passport.initialize());
//app.use(passport.session());

//passport.use(new LocalStrategy(User.authenticate()));
//passport.serializeUser(User.serializeUser());
//passport.deserializeUser(User.deserializeUser());

var postParams;
function moveOn(postData){
    let proceed = true;
    postParams = qString.parse(postData);
    for (property in postParams){
        if (postParams[property].toString().trim() == ''){
            proceed = false;
        }
    }
    return proceed;
}

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

app.post("/userInfo", function(req, res){
    postData = '';
    req.on('data', (data) =>{
        postData+=data;
    })

    req.on('end', async()=>{
        postParams = qString.parse(postData);
        console.log(postData);

        try{
            let coordinates = {}
            
        }
    })
})

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
    let untrusted = {user: req.body.userName, password: genHash(req.body.password)};

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
