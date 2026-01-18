const express = require("express");

const userRouter = express.Router();

const {Login,signUp,sendOtp,changePassword} = require("../Controllers/Auth");

const {auth} = require("../middlewares/auth");

const {resetPasswordToken,resetPassword} = require("../Controllers/resetPass");

//Authentication 
userRouter.post("/login",Login);

userRouter.post("/signUp",signUp);

userRouter.post("/sendOtp",sendOtp);

userRouter.post("/changePassword",auth,changePassword);

//resetPassword

userRouter.post("/reset-password-token",resetPasswordToken);

userRouter.post("/resetPassword",resetPassword);

module.exports = userRouter;