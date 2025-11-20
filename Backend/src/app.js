const express = require('express');
const connectDB = require('./config/database');
const app = express();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const searchCache = require('./utils/searchCache');


const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/requests");
const userRouter = require("./routes/user");

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"]
}));

app.use(express.json());
app.use(cookieParser());

app.use("/" , authRouter);
app.use("/" , profileRouter);
app.use("/" , requestRouter);
app.use("/" , userRouter);

connectDB()
    .then(()=>{
        console.log("Database connected");
        
        searchCache.buildTrie().catch(err => {
            console.error("Failed to build search index:", err);
        });
        
        app.listen(1234,()=>{
            console.log("Server started at port 1234");
        });
    })
    .catch((err)=>{
        console.log("Error connecting to database");
    });