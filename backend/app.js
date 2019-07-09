const path = require("path");
const express = require('express');
const bodyParser = require("body-parser");

const mongoose = require('mongoose');
const postRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');
//
/*
mongodb user password
*/
//bAOPjXFKbR9Fy3V9

//

const app = express(); 
mongoose.connect("mongodb+srv://max:bAOPjXFKbR9Fy3V9@cluster0-49t5g.mongodb.net/node-angular",{ useNewUrlParser: true })
.then(() =>{
    console.log('Connected to database')
})
.catch(() =>{
    console.log('Connection failed !')
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use("/images", express.static(path.join("backend/images")));
app.use((req,res,next) =>{
    res.setHeader('Access-Control-Allow-Origin',"*");
    res.setHeader("Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept,Authorization"
    );
    res.setHeader("Access-Control-Allow-Methods",
    "GET, POST,PUT, PATCH,DELETE, OPTIONS")
    ;
    next();
});


app.use("/api/posts",postRoutes);
app.use("/api/user",userRoutes);
module.exports = app;