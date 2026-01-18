const jwt = require("jsonwebtoken");

require("dotenv").config();

const User = require("../models/User");

//auth
exports.auth = async(req,res,next)=>{
    try{

        const jwtToken = req.header("Authorization")?.replace("Bearer ", "") || req.cookies.jwtToken;
        console.log(req);
        console.log("jwtToken : ",jwtToken);

        if(!jwtToken){
            return res.status(400).json({
                success:false,
                message:"Token not found",
            }) 
        }
        
        console.log("jwtToken :",jwtToken);

        const tokenVerify = await jwt.verify(jwtToken,process.env.SECRET_KEY);

        console.log("token verification : ",tokenVerify);

        req.user = tokenVerify;
        
        next();
    }catch(err){
        res.status(400).json({
            success:false,
            message:err.meaage,
            data:"Error in verifying tokens"
        })
    }
}
//isStudent
exports.isStudent = async(req,res,next)=>{
    try{
        if(req.user.role !== "Student"){
            return res.status(400).json({
                success:false,
                message:"this is a protected route for student"
            })
        }
        next();
    }catch(err){
        res.status(400).json({
            success:false,
            message:err.meaage
        })
    }
}
//isInstructor
exports.isInstructor = async(req,res,next)=>{
    try{
        if(req.user.role !== "Instructor"){
            return res.status(400).json({
                success:false,
                message:"this is a protected route for Instructor"
            })
        }
        next();
    }catch(err){
        res.status(400).json({
            success:false,
            message:err.meaage
        })
    }
}
//isAdmin

exports.isAdmin = async(req,res,next)=>{
    try{
        if(req.user.role !== "Admin"){
            return res.status(400).json({
                success:false,
                message:"this is a protected route for Admin"
            })
        }
        console.log("Routing from Auth to createCourseZz")
        next();
    }catch(err){
        res.status(400).json({
            success:false,
            message:err.meaage
        })
    }
}
