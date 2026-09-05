const express = require("express")
const router =  express.Router()
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../models/User")
//register router

router.post("/register",async(req , res)=>
{
    try{
        const{name,email,password} = req.body
        console.log(req.body)
        const userExisting = await User.findOne({email})
        if(userExisting)
        {
            return res.status(400).json({message : "User Already Exists"})
        }
        const hashPassword = await bcrypt.hash(password,10)
        const user = await User.create({
            name,email,password:hashPassword
        })
        console.log("user created" , user)
         res.status(201).json({
            message: "Registration successful",
            user
        })
    }
    catch(error)
    {
            res.status(500).json({message:error.message})
    }
})

//login

router.post("/login",async(req,res)=>
{
    try{
       const {email , password} = req.body
       console.log(req.body)
       const user = await User.findOne({email})
       if(!user)
       {
        return res.status(400).json({
            message : "Invalid email or password"
        })
       }
       const isPasswordCorrect = await bcrypt.compare(
        password , user.password
       )
       if (!isPasswordCorrect) {
            return res.status(400).json({
                message: "Invalid email or password"
            })
        }
        const token = jwt.sign(
               { userId:user._id},
               process.env.JWT_SECRET,
               {expiresIn :"1d"}
        )
        res.json({message : "Login Successful " ,token})
    }
    catch(error){
        res.status(500).json({message :error.message})
    }
})
module.exports = router