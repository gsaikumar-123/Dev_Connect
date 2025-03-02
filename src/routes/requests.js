const express = require("express");
const {userAuth} = require("../middlewares/auth");
const requestRouter = express.Router();
const ConnectionRequestModel = require("../models/connectionRequest");
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

        const existingConnectionRequest = await connectionRequest.findOne({
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

        const connectionRequest = new ConnectionRequestModel({
            fromUserId,
            toUserId,
            status
        });

        await connectionRequest.save();
        res.send({
            message : req.user.firstName + status + toUser.firstName,
            connectionRequest
        });
    }
    catch(err){
        res.send("Error : " + err);
    }
});







module.exports = requestRouter;