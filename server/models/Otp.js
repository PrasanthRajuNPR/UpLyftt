const mongoose = require("mongoose");

const mailSender = require("../utils/mailSender");

const otpSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
    },
    otp:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        required:true,
        default:Date.now,
        expires:60*5
    }
})

async function sendmail({email,otp}){
    try{
        const mailsend = await mailSender(email,"Otp verification for signUp",otp);
        console.log(mailsend);
    }catch(err){
        console.log("Error :",err.message);
    }
}

otpSchema.pre("save",async function(next){
    await sendmail({email:this.email,otp:this.otp});
    next();
})

module.exports = mongoose.model("OTP",otpSchema);