const express = require('express');
const userRouter = express.Router();
const { userAuth } = require('../middlewares/auth');
const User = require('../models/user');
const ConnectionRequest = require('../models/connectionRequest');
const searchCache = require('../utils/searchCache');

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
        }).populate('fromUserId','firstName lastName age gender about photoUrl skills');

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

userRouter.get('/user/search', userAuth, async (req, res) => {
    try {
        const { q } = req.query;
        
        if (!q || q.trim().length === 0) {
            return res.status(400).json({ 
                success: false,
                message: 'Search query is required' 
            });
        }

        if (searchCache.needsRebuild()) {
            await searchCache.buildTrie();
        }

        const matchingUserIds = searchCache.search(q);

        if (matchingUserIds.length === 0) {
            return res.json({
                success: true,
                data: [],
                message: 'No users found'
            });
        }

       
        const loggedInUser = req.user;
        const users = await User.find({
            _id: { 
                $in: matchingUserIds,
                $ne: loggedInUser._id
            }
        })
        .select('firstName lastName photoUrl about skills gender age')
        .limit(20);

        res.json({
            success: true,
            data: users,
            count: users.length
        });
    } catch (err) {
        console.error('Search error:', err);
        res.status(500).json({ 
            success: false,
            message: 'Error searching users: ' + err.message 
        });
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
        }).populate('fromUserId','firstName lastName gender photoUrl age about skills')
        .populate('toUserId','firstName lastName gender photoUrl age about skills');



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


