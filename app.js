//written by juliann u & yash mhaske, code modified from here:  https://www.geeksforgeeks.org/login-form-using-node-js-and-mongodb/
//Reference: APW JS Final Lab code by Prof. Jacob Levy
var express = require("express"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    LocalStrategy = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    bodyParser = require('body-parser');
    http = require("http");
    qString = require('querystring');
var ObjectID = require('mongodb').ObjectID;
let dbManager = require("./database/dbManager");
//let celestial = require('d3-celestial');


const User = require("./models/users");
const userCol = require("./models/userInfo");

var postData;

//API Stuff
const axios = require('axios');
const ZIP_API_URL = 'https://api.openweathermap.org/data/2.5/weather?zip=';
const ZIP_API_KEY = '116b498b620ae1272a3f6b1d7c177f21';
//const ENTIRE_API_URL = `${ZIP_API_URL}${zipcode},${country}&appid=${ZIP_API_KEY}`;

function docifyInfo(params){
    let doc = new userCol({zipcode: params.zipcode,
    date: params.date, time: params.time, country: params.country})
    return doc;
}

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

mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('bufferCommands', false);

//mongoose.connect("mongodb://localhost/auth_demo_app");

let app = express();
let session = require('express-session');
app.set("view engine", "ejs");

app.use(require("express-session")({
    secret: "This is a test",
    resave: false,
    saveUninitialized: false
}));

//For gif display on homepage
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));

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
        let user = await User.findOne({_id: ObjectID(req.params.userID)});
        //console.log(user);

    } catch(err) {
        console.log(err.message);
    }

    res.render("userInfo");
});



let coordinates = {}
app.post("/userInfo", isLoggedIn, async function(req, res){
    postData = '';
    req.on('data', (data) => {
        postData+=data;
    })
    req.on('end', async() => {
        postParams = qString.parse(postData);
        console.log(postData);

        try{
            let newInfo = {};
            newInfo.zipcode = req.body.zipcode;
            newInfo.date = req.body.date;
            newInfo.time = req.body.time;
            newInfo.country = req.body.country;

            await docifyInfo(newInfo).save();

            const ENTIRE_API_URL = `${ZIP_API_URL}${newInfo.zipcode},${newInfo.country}&appid=${ZIP_API_KEY}`;
            
            axios.get(ENTIRE_API_URL).then(response=>{
                coordinates.latitude = response.data.coord.lat;
                coordinates.longitude = response.data.coord.lon;

                //const display = (`The coordinates of ${newInfo.zipcode} are: \n
                //Latitude: ${coordinates.latitude} \n
                //Longitude: ${coordinates.longitude} \n
                //Current cloud cover at ${newInfo.zipcode}, ${response.data.name} is ${weather} %!`);
                //console.log(display);
            })

        } catch (err){
            next(err);
        }
        
    })
})


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
        await mongoose.connect('mongodb://localhost:27017/jsprojectDB', {useNewUrlParser: true, useUnifiedTopology: true})
    } catch(e){
        console.log(e.message);
    }
    console.log("Server is fine and running");
});
