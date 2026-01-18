const mongoose = require("mongoose");

const course= new mongoose.Schema({
    courseName:{
        type:String,
    },
    courseDescription:{
        type:String,
    },
    instructor:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User", 
    },
    whatYouWillLearn:{
        type:String,
    },
    courseContent:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Section",
        }
    ],
    ratingAndReview:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"ratingAndReview",
        }
    ],
    price:{
        type:Number,
    },
    tag:{
        type:[String]
    },
    thumbnail:{
        type:String,
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category"
    },
    studentsEnrolled:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User"
        }
    ],
    instructions:{
        type:[String]
    },
    status:{
        type:String,
        enum:["Draft","Published"]
    },
    thumbnail:{
        type:String,
    },
    createdAt: {
		type:Date,
		default:Date.now
	},
	ratingAndReviews: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "ratingAndReview",
		},
	],
    
})

module.exports = mongoose.model("Course",course);