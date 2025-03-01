const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = mongoose.Schema({
    firstName : {
        type : String,
        required : true,
        minlength : 4,
        maxlength : 50
    },
    lastName : {
        type : String
    },
    emailId : { 
        type : String,
        required : true,
        unique : true,
        lowercase : true,
        trim : true,
        validator : function(value){
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email");
            }
        }
    },
    password : {
        type : String,
        required : true,
        validator : function(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Password is not strong enough");
            }
        }
    },
    age : {
        type : Number,
        min : 18
    },
    gender : {
        type : String
    },
    photoUrl : {
        type : String,
        validator : function(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid URL");
            }
        }
    },
    about : {
        type : String,
        default : "Hey there"
    },
    skills : {
        type : [String]
    }
},
{
    timestamps : true,
});


const User = mongoose.model("User",userSchema);

module.exports = User;