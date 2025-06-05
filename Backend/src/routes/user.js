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

userRouter.get("/user/feed",userAuth,async(req,res)=>{
    try{
        const loggedInUser = req.user;
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 5;
        limit = limit > 20 ? 5 : limit;
        const skip = (page - 1) * limit;
        const connectionRequests = await ConnectionRequest.find({
            $or:[
                {fromUserId:loggedInUser._id},
                {toUserId:loggedInUser._id}
            ]
        }).select('fromUserId toUserId');

        const hideUsersFromFeed = new Set();
        connectionRequests.forEach((row)=>{
            hideUsersFromFeed.add(row.fromUserId);
            hideUsersFromFeed.add(row.toUserId);
        });

        const users = await User.find({
            _id : {
                $nin : Array.from(hideUsersFromFeed)
            }
        })
        .select('firstName lastName photoUrl about skills gender age')
        .skip(skip)
        .limit(limit);

        if(!users){
            return res.send("No New users found");
        }

        res.json({
            data : users,
        })
    }
    catch(err){
        res.send("Error : " + err);
    }
});


module.exports = userRouter;


