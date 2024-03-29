const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const auth=require('./middleware');
const router = express.Router();

router.post("/signup",(req, res, next) => {
   bcrypt.hash(req.body.password, 10)
   .then(hash =>{
    const user  = new User({
        email: req.body.email,
        password: hash
    });
    user.save()
   .then(result =>{
       res.status(201).json({
        message: "User created",
        result: result
       });
   }) 
   .catch(err =>{
       res.status(500).json({
          
               message: "Invalid authentication credentials !"
       });
    });
   });
});


router.post("/login",(req,res,next) =>{
    let fetchUser;
   User.find({email: req.body.email })
   .then(user =>{
       if(!user){
           return res.status(401).json({
               message: "Auth failed"

           })
       }
      fetchUser = user;
     return  bcrypt.compare(req.body.password, user[0].password);
   })
   .then(result =>{
       
    if(!result){
        return res.status(401).json({
            message: "Invalid authentication credentials !"
        });
    }
    
    const token = jwt.sign({email: fetchUser[0].email, userId: fetchUser[0]._id}, "secret_this_should_be_longer",
     {expiresIn: "1h"}
     );
     res.status(200).json({
         token: token,
         expiresIn: 3600,
         userId: fetchUser[0]._id
     });

   })
   .catch(err =>{
    return res.status(401).json({
        message: "You are not authenticated !"
    });
   })
});
module.exports = router;