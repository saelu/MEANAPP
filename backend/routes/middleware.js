const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

let createToken=(req,res,next)=>{
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
            message: "Auth failed"
        });
    }
    
    const token = jwt.sign({email: fetchUser[0].email, userId: fetchUser[0]._id}, "secret_this_should_be_longer",
     {expiresIn: "1h"}
     );
     next();
    //  res.status(200).json({
    //      token: token
    //  });
    
   })
   .catch(err =>{
    return res.status(401).json({
        message: "Auth failed"
    });
   })
}

module.exports={
    createToken:createToken
}