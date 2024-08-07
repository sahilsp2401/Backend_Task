const express = require("express");
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/User');


router.post('/registeruser',[
    body('username',"Enter a valid name").isLength({min:2}),
    body('fullname',"Enter a valid name").isLength({min:5}),
    body('phoneNumber').isLength({ min: 10, max: 10 }),
    body('email',"Enter a valid email").isEmail(),
    body('password',"Password must be atleast 5 characters").isLength({min:5})
],async (req,res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    try{
    const {email,username,phoneNumber} = req.body;
    let user = await User.findOne({
        $or: [
            { email },
            { username },
            { phoneNumber }
        ]
    });
    if(user){
        return res.status(400).json({error : "Sorry a user with this credentials already exists!!!"})
    }
    user = await User.create({
        fullname: req.body.fullname,
        username: req.body.username,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,
        address: req.body.address,
        password:req.body.password,
    });
    res.json({message: "Account Created Successfully",user});
    }
    catch(error){
        console.error(error.message);
        res.status(500).send("Internal Server Error")
    }
});




module.exports = router
