const express = require("express");
const authRouter = express.Router();
const User = require('../models/user');
const {validateSignUpdata} = require("../utils/validation");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");


authRouter.get("/");

authRouter.post("/signup",async (req,res)=>{
    try{
        validateSignUpdata(req);
        const {firstName,lastName,emailId,password} = req.body;
        const passwordHash = await bcrypt.hash(password,10);

        const user = new User({
            firstName,
            lastName,
            emailId,
            password : passwordHash,
        });

        await user.save();
        res.send("User created");
    }
    catch(err){
        res.send("Error : " + err);
    }
});

authRouter.post("/login",async (req,res)=>{    
    try{
        const {emailId,password} = req.body;
        const user = await User.findOne({emailId : emailId});
        if(!user){
            throw new Error("Invalid Credentials");
        }

        const isMatch = await user.validatePassword(password);

        if(isMatch){
            const token = await user.getJWT();

            res.cookie("token",token,{
                expires : new Date(Date.now() + 3600000),
            });
            res.send("Login Success");
        }
        else{
            throw new Error("Invalid Credentials");
        }
    }
    catch(err){
        res.send("Error : " + err);
    }
});

authRouter.post("/logout",async (req,res)=>{
    res.cookie("token",null,{
        expires : new Date(Date.now()),
    });
    res.send("Log Out Successfully");
});



module.exports = authRouter;

