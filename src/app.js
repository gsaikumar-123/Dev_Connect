const express = require('express');
const connectDB = require('./config/database');
const app = express();
const User = require('./models/user');


app.post("/signup",async (req,res)=>{
    const user = new User({
        firstName : "Sambar",
        lastName : "Idly",
        emailId : "sambaridlys123@gmail.com",
        password : "123456",
        age : 21,
        gender : "male",
    });

    await user.save();
    res.send("User created");
});



connectDB()
    .then(()=>{
        console.log("Database connected");
        app.listen(1234,()=>{
            console.log("Server started at port 1234");
        });
    })
    .catch((err)=>{
        console.log("Error connecting to database");
    });