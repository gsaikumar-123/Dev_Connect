const express = require('express');
const app = express();

app.listen(1234,()=>{
    console.log('Server is running on port 1234...');
});

app.use((req,res)=>{
    res.send("I am listening");
});