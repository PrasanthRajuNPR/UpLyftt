const User = require("../models/User")

const Otp = require("../models/Otp")

const Profile = require("../models/Profile") 

const bcrypt = require("bcrypt");

const jsonwebtoken = require("jsonwebtoken");
const mailSender = require("../utils/mailSender");

require("dotenv").config();

//sendOtp

exports.sendOtp = async(req,res)=>{
    try{

        const {email} = req.body;

        console.log("Email : ",email);
    
        const findemailExists = await User.findOne({email:email});

        if(findemailExists){
            return res.status(402).json({
                success:false,
                message:"user already exists please login",
            })
        }

        let otp = Math.floor(Math.random()*1000000);

        console.log("OTP : ",otp);

        let checkExistingOtp = await Otp.findOne({otp:otp});

        while(checkExistingOtp){
            otp = Math.floor(Math.random()*1000000);
            checkExistingOtp = await Otp.findOne({otp:otp});
        }

        let newOtp='';

        const checkuser = await Otp.findOne({email});
        console.log("user with otp existed ",checkuser);
        if(checkuser){
            newOtp = await Otp.findOneAndUpdate({email:email},{otp:otp},{new:true});
        }
        else{
            newOtp = await Otp.create({email:email,otp});
        }

        console.log("new Otp created for user ",email,newOtp);

        res.status(200).json({
            success:true,
            message:"Otp sent SuccessFully"
        })

    }catch(err){
        console.log(err);
        res.status(400).json({
            success:false,
            message:err.message,
            data:newOtp,
        })
    }
}

//signUp

exports.signUp = async(req,res)=>{
    try{
        console.log("server recieved data")
        const {firstName,lastName,email,password,confirmPassword,accountType,otp} = req.body;
        console.log(firstName,lastName,email,password,confirmPassword,accountType,otp);
        console.log("Otttp : "+otp)
        if(!firstName || !lastName || !email || !password || !confirmPassword || !accountType || !otp){
            return res.status(400).json({
                success:false,
                message:"All fields required",
            })
        }

        const checkEmailExistance  = await User.findOne({email});

        if(checkEmailExistance){
            return res.status(400).json({
                success:false,
                message:"User already exists",
            })
        }

        if(password !== confirmPassword){
            return res.status(400).json({
                success:false,
                message:"Passwords incoorect",
            })
        }

        const recentOtp = await Otp.find({email:email}); 
        
        console.log(otp,recentOtp,email);

        if(otp !== recentOtp[0].otp){
            return res.status(400).json({
                success:false,
                message:"Please enter valid Otp"
            })
        }
        
        const hashPass = await bcrypt.hash(password,10);

        console.log(hashPass);

        const profile = await Profile.create({gender:null,dataOfBirth:null,contactNumber:null});

        console.log(profile);

        const user = await User.create({
            firstName,lastName,email,password:hashPass,accountType,additionalDetails:profile._id,image:`https://api.dicebear.com/5.x/initials/svg?seed=${firstName}${lastName}`,
        });

        console.log(user);
        
        res.status(200).json({
            success:true,
            message:"user created Successfully",
            data:user
        })
    }catch(err){
        res.status(400).json({
            success:false,
            message:"user cannot be created try again",
            error:err.message
        })
    }
}

//login

exports.Login = async (req,res)=>{
    try{
        const {email,password} = req.body;

        console.log("Email : ",email,"Password: ",password)
        if(!email || !password){
            return res.status(402).json({
                success:false,
                message:"All feilds required"
            })
        }

        const checkEmail = await User.findOne({email:email}).populate("additionalDetails");

        console.log(checkEmail);

        if(!checkEmail){
            return res.status(402).json({
                success:false,
                message:"user does not exixts please signin first"
            })
        }

        const checkPass = await bcrypt.compare(password,checkEmail.password);

        console.log(await bcrypt.hash(password,10)," compared ",checkEmail.password);

        if(!checkPass){
            console.log("Password not matched");
            return res.status(400).json({
                success:false,
                message:"Password not matched",
            })
        }

        const payload = {email:checkEmail.email,role:checkEmail.accountType,id:checkEmail._id}
        let jwtToken = await jsonwebtoken.sign(payload,process.env.SECRET_KEY,{expiresIn:'24h'});

        console.log("JWTToken: ",jwtToken);

        checkEmail.jwtToken = jwtToken;
        
        await checkEmail.save();

        const options = {
            expires: new Date(Date.now() + (24 * 60 * 60 * 1000)),
            httpOnly: true,
        }

        res.status(200).cookie("jwtToken",jwtToken,options).json({
            success:true,
            message:"successfully Loged in",
            data:jwtToken,
            user:checkEmail
        })
    }catch(err){
        res.status(400).json({
            success:false,
            message:err.message,
            error:err
        })
    }
}

exports.changePassword = async (req, res) => {
    try {
      // Get user data from req.user
      const userDetails = await User.findById(req.user.id)
  
      // Get old password, new password, and confirm new password from req.body
      const { oldPassword, newPassword } = req.body
      console.log(await bcrypt.hash(oldPassword,10),userDetails.password);
      // Validate old password
      const isPasswordMatch = await bcrypt.compare(
        oldPassword,userDetails.password
      )
      console.log(isPasswordMatch)
      if (!isPasswordMatch) { 
        // If old password does not match, return a 401 (Unauthorized) error
        return res
          .status(401)
          .json({ success: false, message: "The password is incorrect" })
      }
  
      // Update password
      const encryptedPassword = await bcrypt.hash(newPassword, 10)
      const updatedUserDetails = await User.findByIdAndUpdate(
        req.user.id,
        { password: encryptedPassword },
        { new: true }
      )
  
      // Send notification email
      try {
        const emailResponse = await mailSender(
          updatedUserDetails.email,
          "Password for your account has been updated",
            `Password updated successfully for ${updatedUserDetails.firstName} ${updatedUserDetails.lastName}`
        );
        console.log("Email sent successfully:");
      } catch (error) {
        // If there's an error sending the email, log the error and return a 500 (Internal Server Error) error
        console.error("Error occurred while sending email:", error)
        return res.status(500).json({
          success: false,
          message: "Error occurred while sending email",
          error: error.message,
        })
      }
  
      // Return success response
      return res
        .status(200)
        .json({ success: true, message: "Password updated successfully" })
    } catch (error) {
      // If there's an error updating the password, log the error and return a 500 (Internal Server Error) error
      console.error("Error occurred while updating password:", error)
      return res.status(500).json({
        success: false,
        message: "Error occurred while updating password",
        error: error.message,
      })
    }
  }