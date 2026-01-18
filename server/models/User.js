const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        trim:true,
    },
    lastName:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        trim:true,
    },
    password:{
        type:String,
        required:true,
    },
    phoneNumber:{
        type:String,
    },
    active: {
			type: Boolean,
			default: true,
		},
    approved: {
        type: Boolean,
        default: true,
    },
    accountType:{
        type:String,
        enum:["Admin","Student","Instructor"],
        required:true,
    },
    
    additionalDetails:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Profile",
    },
    courses:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Course"
        }
    ],
    jwtToken:{
        type:String,
    },
    resetPassToken:{
        type:String,
    },
    resetTokenExpires:{
        type:String,
    },
    image:{
        type:String,
    },
    courseProgress:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"CourseProgress",
        }
    ]
},
{ timestamps: true }
)

module.exports = mongoose.model("User",userSchema);