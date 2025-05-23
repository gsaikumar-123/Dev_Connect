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
        }).populate('fromUserId','firstName lastName');

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
        const connectionRequests = await ConnectionRequest.find({
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
        }).populate('fromUserId','firstName lastName')
        .populate('toUserId','firstName lastName');



        if(!connectionRequests){
            return res.send("No connections found");
        }

        const data = connectionRequests.map((row)=>{
            if(row.fromUserId._id.toString()===loggedInUser._id.toString()){
                return row.toUserId;
            }
            return row.fromUserId;
        });
            

        res.json({
            connections : data,
            message : loggedInUser.firstName + " you have " + connectionRequests.length + " connections"
        })
    }
    catch(err){
        res.send("Error : " + err);
    }
});





module.exports = userRouter;


