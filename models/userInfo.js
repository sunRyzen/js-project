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
        }
})

const userCol = mongoose.model('UserInfo', UserInfoSchema);

module.exports = userCol;