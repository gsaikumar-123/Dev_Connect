const express = require('express');
const userRouter = express.Router();
const { userAuth } = require('../middlewares/auth');
const User = require('../models/user');
const ConnectionRequest = require('../models/connectionRequest');

userRouter.get('/user/view', userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        res.send(loggedInUser);
    }
    catch (err) {
        res.send('Error : ' + err);
    }
});

userRouter.get("/user/requests", userAuth ,async(req,res)=>{
    try{
        const loggedInUser = req.user;
        const requests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status : "interested"
        }).populate("fromUserId","firstName lastName");

        if(!requests){
            return res.send("No requests found");
        }

        res.json({
            data : requests,
            message : loggedInUser.firstName + " you have " + requests.length + " requests"
        })
    }
    catch(err){
        res.send("Error : " + err);
    }
});

userRouter.get("/user/connections",userAuth,async(req,res)=>{
    try{
        const loggedInUser = req.user;
        const connections = await ConnectionRequest.find({
            $or:[
                {
                    fromUserId:loggedInUser._id,
                    status : "accepted"
                },
                {
                    toUserId:loggedInUser._id,
                    status : "accepted"
                }
            ]
        });

        if(!connections){
            return res.send("No connections found");
        }

        res.json({
            connections : connections,
            message : loggedInUser.firstName + " you have " + connections.length + " connections"
        })
    }
    catch(err){
        res.send("Error : " + err);
    }
});


module.exports = userRouter;


