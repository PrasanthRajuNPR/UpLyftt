const Course = require("../models/Course");
const User = require("../models/User");
const Category = require("../models/Category");
const imageUploader = require("../utils/imageUploader");
const cloudinary = require("cloudinary").v2;
require("dotenv").config();
const Section = require("../models/Section");
const SUbSection = require("../models/SubSection");
const SubSection = require("../models/SubSection");
const CourseProgress = require("../models/CourseProgress")
exports.createCourse = async (req,res)=>{ 
    try{
        const {courseName,courseDescription,whatYouWillLearn,price,category,tag} = req.body;

        const thumbnail = req.files.thumbnailImage;

        console.log(thumbnail)
        console.log("category : in createCOurse "+category);

        if(!thumbnail || !courseName || !courseDescription || !whatYouWillLearn || !category || !price){
            return res.status(400).json({
                success:false,
                message:"All feilds required"
            })
        }

        const userid = req.user.id;

        if(!userid){
            return res.status(400).json({
                success:false,
                message:"userid not found"
            })
        }

        const instructorDetails = await User.findById(userid);

        console.log("Instructor Details : ",instructorDetails);

        if(!instructorDetails){
            return res.status(400).json({
                success:false,
                message:"instructor details not found"
            })
        }

        const categoryDetails = await Category.findById(category);

        if(!categoryDetails){
            return res.status(400).json({
                success:false,
                message:"category details not found"
            })
        }

        console.log("Category : ",category)

        const thumbnailImage = await imageUploader(thumbnail.tempFilePath,process.env.CLOUD_FOLDER)

        console.log(thumbnailImage);
        
        const newCourse = await Course.create({
            courseName,
            courseDescription,
            category:categoryDetails._id,
            thumbnail:thumbnailImage.secure_url,
            price,
            instructor:instructorDetails._id,
            whatYouWillLearn:whatYouWillLearn,
            tag,

        }
        )
        console.log("new course : ",newCourse)
        
        
        await User.findByIdAndUpdate(
            {_id:instructorDetails._id},
            {
                $push:{
                    courses:newCourse._id,
                }
            },
            { new: true }
        )
        const categoryDetails2 = await Category.findByIdAndUpdate(
            { _id: category },
            {
                $push: {
                courses: newCourse._id,
                },
            },
            { new: true }
            )
    console.log("HEREEEEEEEE", categoryDetails2)

        res.status(200).json({
            success:true,
            message:"Course created Successfully",
            data:newCourse
        })

    }catch(err){
        res.status(400).json({
            success:false,
            message:err.message,
            error:err
        })
    }
}   


//edit course

exports.editCourse = async(req,res)=>{
    try{
        const {courseId} = req.body;

        const updates = req.body;

        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({ error: "Course not found" })
        }

        if(req.files){
            const thumbnail = req.files.thumbnail;

            const thumbnailUpload = await imageUploader(thumbnail,process.env.CLOUD_FOLDER);

            course.thumbnail = thumbnailUpload.secure_url;
        }

        for(const key in updates){
            if(updates.hasOwnProperty(key)){
                if(key === "tag" || key === "instructions"){
                    course[key] = JSON.parse(updates[key]);
                }else{
                    course[key] = updates[key];
                }
            }
        }

        await course.save();
                                        console.log("hello")

       const updatedCourse = await Course.findOne({ _id: courseId })
                                        .populate({
                                            path: "instructor",
                                            populate: {
                                            path: "additionalDetails",
                                            },
                                        })
                                        .populate("category")
                                        .populate({
                                            path: "ratingAndReviews",
                                            match: { _id: { $exists: true } },    // populate only if reviews exist
                                        })
                                        .populate({
                                            path: "courseContent",
                                            populate: {
                                            path: "subSection",
                                            match: { _id: { $exists: true } },  // populate subsections only if present
                                            },
                                        }).exec();
          res.json({
            success: true, 
            message: "Course updated successfully",
            data: updatedCourse,
          })
    }
    catch(error){
        console.error(error)
        res.status(500).json({
          success: false,
          message: "Internal server error",
          error: error.message,
        })
    }
}

//show all courses 

exports.allCourses = async (req,res)=>{
    try{
        const allCourses = await Course.find({},{courseName:true,
                                                 courseDescription:true,
                                                 thumbnail:true,
                                                 ratingAndReview:true,
                                                 studentsEnrolled:true,
                                                 instructor:true,
                                                price:true}).populate("instructor").exec();

        res.status(200).json({
            success:true,
            data:allCourses,
            message:"All courses data fetched successfully"
        })
    }catch(err){
        res.status(400).json({
            success:false,
            message:err.message,
        })
    }
}

exports.getCourseDetails = async (req, res) => {
  try {
    const { courseId } = req.body
    const courseDetails = await Course.findOne({
      _id: courseId,
    })
      .populate({
        path: "instructor",
        populate: {
          path: "additionalDetails",
        },
      })
      .populate("category")
      .populate("ratingAndReview")
      .populate({
        path: "courseContent",
        populate: {
          path: "subSection",
          select: "-videoUrl",
        },
      })
      .exec()

    if (!courseDetails) {
      return res.status(400).json({
        success: false,
        message: `Could not find course with id: ${courseId}`,
      })
    }

    // if (courseDetails.status === "Draft") {
    //   return res.status(403).json({
    //     success: false,
    //     message: `Accessing a draft course is forbidden`,
    //   });
    // }

    let totalDurationInSeconds = 0;

        courseDetails.courseContent.forEach((content) => {
        content.subSection.forEach((subSection) => {
            const timeDurationInSeconds = parseInt(subSection.timeDuration, 10); // Always specify the base (10)
            
            if (!isNaN(timeDurationInSeconds)) { // Check if it's a valid number
            totalDurationInSeconds += timeDurationInSeconds;
            } else {
            console.warn('Invalid timeDuration:', subSection.timeDuration);
            }
        });
        });

        console.log("Total Duration: ", totalDurationInSeconds);


    const totalDuration = convertSecondsToDuration(totalDurationInSeconds)
    console.log("tot..................",totalDurationInSeconds)
    return res.status(200).json({
      success: true,
      data: {
        courseDetails,
        totalDuration,
      },
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    })
  }
}

function convertSecondsToDuration(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
  
    // Pad the values to ensure they are always two digits
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  }
exports.getFullCourseDetails = async (req,res)=>{
    try{
        const {courseId} = req.body;
        const userId = req.user.id;

        const courseDetails = await Course.findById({_id:courseId}).populate(
                                                                                {
                                                                                    path:"instructor",
                                                                                    populate:{
                                                                                        path:"additionalDetails"
                                                                                    }
                                                                                }
                                                                            )
                                                                    .populate("category")
                                                                    .populate("ratingAndReview")
                                                                     .populate(
                                                                        {
                                                                            path:"courseContent",
                                                                            populate:{
                                                                                path:"subSection"
                                                                            }
                                                                        }
                                                                    )
                                                                    .exec();
        let courseProgressCount = await CourseProgress.findOne({
            courseID: courseId,
            userId: userId,
            })

        if(!courseDetails){
            return res.status(400).json({
                success:false,
                message:`Could not found course with id : ${courseId}`
            })
        }
        console.log("courseProgressCount : ", courseProgressCount)
        if (!courseDetails) {
            return res.status(400).json({
              success: false,
              message: `Could not find course with id: ${courseId}`,
            })

          }

          let totalDurationInSeconds = 0;

        courseDetails.courseContent.forEach((content) => {
        content.subSection.forEach((subSection) => {
            const timeDurationInSeconds = parseInt(subSection.timeDuration, 10); // Always specify the base (10)
            
            if (!isNaN(timeDurationInSeconds)) { // Check if it's a valid number
            totalDurationInSeconds += timeDurationInSeconds;
            } else {
            console.warn('Invalid timeDuration:', subSection.timeDuration);
            }
        });
        });

        console.log("Total Duration: ", totalDurationInSeconds);


        const totalDuration = convertSecondsToDuration(totalDurationInSeconds)
        return res.status(200).json({
            success:true,
            message:"successfully fetched course details",
            data: {
                courseDetails,
                totalDuration,
                completedVideos: courseProgressCount?.completedVideos
                  ? courseProgressCount?.completedVideos
                  : [],
              },
        })
    }catch(err){
        res.status(400).json({
            success:false,
            message:err.message
        })
    }
}

//instructor courses

exports.getInstructorCourses = async (req,res)=>{
    try{
        const instructorId = req.user.id;

        const instructorCourses = await Course.find({instructor:instructorId}).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: instructorCourses,
        })
    }
    catch(error){
        console.error(error)
        res.status(500).json({
        success: false,
        message: "Failed to retrieve instructor courses",
        error: error.message,
    })
    }
}

//delete course 
exports.deleteCourse = async(req,res)=>{
    try{
        const {courseId} = req.body;

        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({ message: "Course not found" })
        }

        //unenroll students
        const students =  course.studentsEnrolled;

        for(const studentId of students){
            await User.findByIdAndUpdate({_id:studentId},{$pull:{courses:courseId}});
        }

        //remove subsections and section

        const courseSections = course.courseContent
            for (const sectionId of courseSections) {
            // Delete sub-sections of the section
            const section = await Section.findById(sectionId)
            if (section) {
                const subSections = section.subSection
                for (const subSectionId of subSections) {
                await SubSection.findByIdAndDelete(subSectionId)
                }
            }

            // Delete the section
            await Section.findByIdAndDelete(sectionId)
            }
        //delete course

        await Course.findByIdAndDelete(courseId);

        return res.status(200).json({
            success: true,
            message: "Course deleted successfully",
          })
      
      
    }
    catch(error){
        console.error(error)
        return res.status(500).json({
          success: false,
          message: "Server erro r",
          error: error.message,
        })
    }
} 