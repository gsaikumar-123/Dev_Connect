const mongoose = require('mongoose');

const connectDB = async() => {
    await mongoose.connect(
        "mongodb+srv://gsaikumar_123:qPzNsLUY8vTmsRV9@mycluster.zten6.mongodb.net/Dev_Connect"
    )
}

module.exports = connectDB;