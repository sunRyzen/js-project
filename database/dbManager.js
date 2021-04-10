//Referred: Database manager code from Mongoose lecture (author: Jacob Levy)

const MongoClient = require('mongodb').MongoClient;
var getID = require('mongodb').ObjectID();
var url = "mongodb://127.0.0.1:27017/";
let database = {};
let mongoClient = MongoClient(url, {useUnifiedTopolgy:true});
let myDB;

var connect = async function(dbName){
    try{
        await mongoClient.connect();

        myDB = mongoClient.db(dbName);

        if(!myDB){
            throw new Error("DB Connection Failed To Start!");
    } else {
        console.log(`Connected to ${dbName}`);
        return myDB;
    }
    } catch(e){
        console.log(e.message);
    }
}

database.get = function(dbName){
    if (myDB){
        return myDB;
    } else {
        return connect(dbName);
    }
}

database.close = async function(){
    try{
        await mongoClient.close();
        return;
    } catch(e){
        console.log(e.message);
    }
}

module.exports = database;