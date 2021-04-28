//Written: Yash M
let mongoose = require("mongoose");

const historySchema = mongoose.Schema({
    zipcode: Number,
    date: Number
})

const historyCol = mongoose.model('history', historySchema);

module.exports = historyCol;