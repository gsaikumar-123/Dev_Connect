const express = require('express');
const app = express();

app.listen(1234);

const {adminAuth,userAuth} = require('./middlewares/auth');

app.use("/admin",adminAuth);

app.post("/user/login",(req,res)=>{
    res.send("User logged in Successfully");
});

app.get("/user/data",userAuth,(req,res)=>{
    res.send("User Data sent");
});

app.get("/admin/getAllData",(req,res)=>{
    res.send("All Data sent");
});

app.get("/admin/deleteUser",(req,res)=>{
    res.send("User deleted");
});





