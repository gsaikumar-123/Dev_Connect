const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema({
    fromUserId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true
    },
    toUserId : {
        type : mongoose.Schema.Types.ObjectId,
        required : true
    },
    status : {
        type : String,
        required : true,
        enum : {
            values : ["ignored","intrested","accepted","rejected"],
            message : "Invalid"
        }
    }
    },
    {
        timestamps : true
    }
);

connectionRequestSchema.index({fromUserId:1,toUserId:1}); //API call is very fast even for billions of records

connectionRequestSchema.pre("save",async function(next){
    const connectionRequest = this;

    if(connectionRequest.fromUserId.equals(connectionRequest.toUserId)){
        throw new Error("Cannot send request to self");
    }

    next();
});

const ConnectionRequestModel = new mongoose.model("ConnectionRequest",connectionRequestSchema);

module.exports = ConnectionRequestModel;
