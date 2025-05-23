const express = require("express");
const {userAuth} = require("../middlewares/auth");
const requestRouter = express.Router();
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

requestRouter.post("/request/send/:status/:toUserId",userAuth,async(req,res)=>{
    try{
        const fromUserId = req.user._id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const isAllowed = ["ignored","intrested"].includes(status);

        if(!isAllowed){
            throw new Error("Invalid status type");
        }

        const existingConnectionRequest = await ConnectionRequest.findOne({
            $or : [
                {fromUserId,toUserId},
                {fromUserId:toUserId,toUserId:fromUserId}
            ],
        });

        if(existingConnectionRequest){
            throw new Error("Request already sent");
        }

        const toUser = await User.findById(toUserId);
        if(!toUser){
            throw new Error("User not found");
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        });

        await connectionRequest.save();
        res.send({
            message : req.user.firstName + " " + status + " " + toUser.firstName,
            connectionRequest
        });
    }
    catch(err){
        res.send("Error : " + err);
    }
});


requestRouter.post("/request/review/:status/:requestId",userAuth,async(req,res)=>{
    try{
        const loggedInUser = req.user;
        const status = req.params.status;
        const requestId = req.params.requestId;

        const isAllowed = ["accepted","rejected"].includes(status); 

        if(!isAllowed){
            throw new Error("Invalid status type");
        }

        const connectionRequest = await ConnectionRequest.findOne({
            _id : requestId,
            toUserId : loggedInUser._id,
            status : "intrested"
        });

        if(!connectionRequest){
            throw new Error("Request not found");
        }

        connectionRequest.status = status;
        await connectionRequest.save();

        res.send({
            message : "Request " + status,
            connectionRequest
        });
    }
    catch(err){
        res.send("Error : " + err);
    }
});

module.exports = requestRouter;