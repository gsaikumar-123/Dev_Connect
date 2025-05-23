const express = require('express');
const userRouter = express.Router();
const User = require('../models/user');
const { userAuth } = require('../middlewares/auth');


userRouter.get("/user/connections",userAuth,async(req,res)=>{});


module.exports = userRouter;


