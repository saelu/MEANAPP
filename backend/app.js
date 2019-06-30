const express = require('express');
const bodyParser = require("body-parser");

const mongoose = require('mongoose');
const Post = require('./models/post');

//
/*
mongodb user password
*/
//bAOPjXFKbR9Fy3V9

//
const app = express(); 
mongoose.connect("mongodb+srv://max:bAOPjXFKbR9Fy3V9@cluster0-49t5g.mongodb.net/node-angular?retryWrites=true&w=majority",{ useNewUrlParser: true })
.then(() =>{
    console.log('Connected to database')
})
.catch(() =>{
    console.log('Connection failed !')
})

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

app.use((req,res,next) =>{
    res.setHeader('Access-Control-Allow-Origin',"*");
    res.setHeader("Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.setHeader("Access-Controll-Allow-Methods",
    "GET, POST, PATCH,DELETE, OPTIONS")
    ;
    next();
})

app.post("/api/posts",(req,res,next) =>{
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    });
    post.save();
    res.status(201).json({
        message: "post added successfully"
    });
});
app.get('/api/posts',(req,res,next) =>{
    Post.find()
    .then(document =>{
        res.status(200).json({
            message :'posts fatched successfully',
            posts :document
        });
    });
   
    });

module.exports = app;