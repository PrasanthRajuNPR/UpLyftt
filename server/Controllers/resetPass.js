const User = require("../models/User");
const mailSender = require("../utils/mailSender");
const crypto = require("crypto")
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
dotenv.config();

exports.resetPasswordToken = async(req,res)=>{
    try{
        const {email} = req.body;

        const validUser = await User.findOne({email});

        if(!validUser){
            return res.status(400).json({
                success:false,
                message:"User not found"
            })
        }

        const resetPassToken = await crypto.randomUUID();

        validUser.resetPassToken = resetPassToken;
        validUser.resetTokenExpires = Date.now() + 5*60*1000;

        await validUser.save();

        const url = `${process.env.BASE_URL}/update-password/${resetPassToken}`

        await mailSender(email,"Password reset token",`Password reset link ${url}`);

        res.status(200).json({
            success:true,
            message:"Password reset link sent successfully"
        })
    }catch(err){
        res.status(400).json({
            success:false,
            message:"Token generation failed",
            error:err.message
        })
    }
}


exports.resetPassword = async (req,res)=>{
    try{
        const {password,confirmPassword,resetPassToken} = req.body;

        console.log("server side : ",password,confirmPassword)

        if(password !== confirmPassword){
            return res.status(400).json({
                success:false,
                message:"checkboth passwords and try again",
            })
            
        }

        const user = await User.findOne({resetPassToken});

        if(!user){
            res.status(400).json({
                success:false,
                message:"User not found"
            })
        }

        if(user.resetTokenExpires<Date.now()){
            res.status(400).json({
                success:false,
                message:"token expired"
            })
        }

        const hashPassword = await bcrypt.hash(password,10);

        const user1 = await User.findOneAndUpdate({resetPassToken},{password:hashPassword},{new:true});
        //tPUfhcDmWecravyttfQhYOi50WsA8mq3wtpINOTrIh7CtduCCh3Gy

        res.status(200).json({
            success:true,
            message:"Password Updated Successfully",
            data:[user,user1,await bcrypt.compare(user1.password,password)]
        })
    }catch(err){
        res.status(400).json({
            success:false,
            message:err.message,
            error:err
        })
    }
}