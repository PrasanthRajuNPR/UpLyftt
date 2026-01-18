const Course = require("../models/Course");
const ratingAndReview = require("../models/RatingAndReview");
const User = require("../models/User");


exports.createRating = async (req,res)=>{
    try{
        const {courseId,rating,review} = req.body;

        const userId = req.user.id;
        console.log("create rating request",courseId," : ",rating," : ",review," : ",userId );

        if(!userId || !courseId  || !review){
            return res.status(400).json({
                success:false,
                message:"All feilds required"
            })
        }
        const userDetails = await User.find({_id:userId});

        if(!userDetails[0].courses.includes(courseId)){
            return res.status(400).json({
                success:false,
                message:"user had not registered the course to give rating & review"
            })
        }

        const checkAlreadyRAR = await ratingAndReview.find({user:userId,course:courseId});
        
        if(!checkAlreadyRAR){
            return res.status(400).json({
                success:false,
                message:"Already RAR",
            })
        }

        const newRAR = await ratingAndReview.create({user:userDetails[0]._id,course:courseId,rating:rating,review:review});
console.log("Rating working ");

        const updateCourse = await Course.findByIdAndUpdate({_id:courseId},
                                                            {$push:{
                                                                ratingAndReview:newRAR._id
                                                            }}
        )

        res.status(200).json({
            success:true,
            message:"Rating and Review Created",
            data:updateCourse
        })
    }catch(err){
        res.status(400).json({
            success:false,
            message:err.message
        })
    }
}

exports.averageRating = async (req,res)=>{
    try{
        const courseId = req.body.courseId;

        const avgRating = await ratingAndReview.aggregate(
                                                          {
                                                            $match:{
                                                                course:mongoose.Types.ObjectId(courseId)
                                                            }
                                                          },
                                                          {
                                                            $group:{
                                                                _id:null,
                                                                averageRating:{$avg:"$rating"},
                                                            }
                                                          } 
        )

        if(avgRating.length>0){
            return res.status(200).json({
                success:true,
                averageRating:avgRating[0].averageRating,
            })
        }

        return res.status(200).json({
            success:false,
            message:"Rating are empty",
            averageRating:0,
        })
    }catch(err){
        res.status(400).json({
            success:false,
            message:err.message
        })
    }
}

exports.getAllRating = async(req,res)=>{
    try{

        const allRatings = await ratingAndReview.find({}).sort({rating:"desc"}).populate(
                                                                                {
                                                                                    path:"user",
                                                                                    select:"firstName lastName email image"
                                                                                })
                                                                                .populate("course");

        res.status(200).json({
            success:true,
            message:"All rating fetched successfully",
            data:allRatings
        })
    }catch(err){
        res.status(400).json({
            success:false,
            message:err.message
        })
    }
}