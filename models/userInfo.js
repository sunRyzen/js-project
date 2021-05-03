//Written: Yash M
let mongoose = require('mongoose');


const UserInfoSchema = mongoose.Schema({
    username: {
          type: String,//UserInfoSchema.username
        },
    zipcode: {
            type: Number,
            required: true
        },  
    date: {
        type: Number,
        required: true
    },
    time:{
        type: Number,
        required: true
    },
    country: {
        type: String, 
        required: true
    }
})

const userCol = mongoose.model('UserInfo', UserInfoSchema);

module.exports = userCol;