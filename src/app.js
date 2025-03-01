const express = require('express');
const connectDB = require('./config/database');
const app = express();
const User = require('./models/user');

app.use(express.json());

app.post("/signup",async (req,res)=>{
    const user = new User(req.body);
    try{
        await user.save();
        res.send("User created");
    }
    catch(err){
        res.send("Error creating user");
    }
});

app.get("/user", async (res,req)=>{
    const userEmail = req.body.emailId;
    try{
        const users = await User.find({emailId : userEmail});
        if(users.length === 0){
            res.send("No user found");
        }
        else{
            res.send(users);
        }
    }
    catch(err){
        res.send("Something went wrong");
    }
});

app.get("/userId",async(req,res)=>{
    const id = req.body.userId;
    try{
        const users = await User.findById(id);
        if(users.length === 0){
            res.send("No user found");
        }
        else{
            res.send(users);
        }
    }
    catch(err){
        res.send("Something went wrong");
    }
});


app.get("/feed",async (req,res)=>{
    try{
        const users = await User.find({});
        res.send(users);
    }
    catch(err){
        res.send("Something went wrong");
    }
})

app.patch("/user/:userId",async (req,res)=>{
    const userId = req.params?.userId;
    const data = req.body;

    try{
        const allowedUpdates = ["photoUrl","about","skills","gender","age"];
        const isUpdateAllowed = Object.keys(data).every((update)=>
            allowedUpdates.includes(update)
        );
        if(!isUpdateAllowed){
            throw new Error("Invalid update");
        }
        if(data?.skills.length > 10){
            throw new Error("Skills limit exceeded");
        }
        const user = await User.findOneAndUpdate({_id : userId},data,{
            reunValidators : true,
        });
        res.send("User updated");
    }
    catch(err){
        res.send("Update failed" + err);
    }
});


connectDB()
    .then(()=>{
        console.log("Database connected");
        app.listen(1234,()=>{
            console.log("Server started at port 1234");
        });
    })
    .catch((err)=>{
        console.log("Error connecting to database");
    });