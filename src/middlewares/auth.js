const jwt = require("jsonwebtoken");
const User = require("../models/user");


const userAuth = async (req,res,next)=>{
    try {
        const cookies = req.cookies;
        const {token} = cookies;

        if(!token){
            throw new Error("User not authenticated");
        }

        const decoddedMessage = jwt.verify(token,"Sai@2304");
        const {_id} = decoddedMessage;

        const user = await User.findById(_id);

        if(!user){
            throw new Error("User Not found");
        }
        req.user = user;
        next();
    } 
    catch (err) {
        res.send("Error : " + err);
    }

}

module.exports = {
    userAuth
};