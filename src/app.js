const express = require('express');
const connectDB = require('./config/database');
const app = express();
const cookieParser = require("cookie-parser");


const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");

app.use(express.json());
app.use(cookieParser());

app.use("/" , authRouter);
app.use("/" , profileRouter);
app.use("/" , requestRouter);

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