const Profile = require("../models/Profile");
const { findByIdAndDelete } = require("../models/Section");
const imageUploader = require("../utils/imageUploader")
const User = require("../models/User");
const Course = require("../models/Course");
const { default: mongoose } = require("mongoose");
const CourseProgress = require("../models/CourseProgress");
exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, gender, dateOfBirth, about, contactNumber } = req.body;
    const userId = req.user.id;

    if (!userId || (!gender && !contactNumber && !about && !dateOfBirth && !firstName && !lastName)) {
      return res.status(400).json({
        success: false,
        message: "At least one field must be updated",
      });
    }

    let user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const updatedUserDetails = {};
    if (firstName) updatedUserDetails.firstName = firstName;
    if (lastName) updatedUserDetails.lastName = lastName;

    // Update profile fields if provided
    let updatedProfile = await Profile.findById(user.additionalDetails);
    const updatedProfileFields = {};

    if (contactNumber) updatedProfileFields.contactNumber = contactNumber;
    if (gender) updatedProfileFields.gender = gender;
    if (dateOfBirth) updatedProfileFields.dateOfBirth = dateOfBirth;
    if (about) updatedProfileFields.about = about;
    console.log("Contact Numberuuuuu : ",contactNumber)
    console.log("Data of Birthuuuuu : ",dateOfBirth);
    // Apply partial update to the profile if there are any changes
    if (Object.keys(updatedProfileFields).length) {
      updatedProfile = await Profile.findByIdAndUpdate(
        user.additionalDetails,
        updatedProfileFields,
        { new: true }
      );
    }

    // Update User fields as well
    user = await User.findByIdAndUpdate(userId, updatedUserDetails, { new: true })
      .populate("additionalDetails");

    res.status(200).json({
      success: true,
      message: "Profile Updated Successfully",
      data: user,
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
      error: err,
    });
  }
};


//delete Account
exports.deleteAccount = async (req, res) => {
  try {
    const id = req.user.id
    console.log(id)
    const user = await User.findById({ _id: id })
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      })
    }
    // Delete Assosiated Profile with the User
    await Profile.findByIdAndDelete({
      _id: new mongoose.Types.ObjectId(user.additionalDetails),
    })
    for (const courseId of user.courses) {
      await Course.findByIdAndUpdate(
        courseId,
        { $pull: { studentsEnrolled: id } },
        { new: true }
      )
    }
    // Now Delete User
    await User.findByIdAndDelete({ _id: id })
    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    })
    await CourseProgress.deleteMany({ userId: id })
  } catch (error) { 
    console.log(error)
    res
      .status(500)
      .json({ success: false, message: "User Cannot be deleted successfully" })
  }
}

exports.getAllUserDetails = async (req,res)=>{
    try{

        const id = req.user.id;

        const userDetails = await User.find({}).populate("additionalDetails").exec();

        res.status(200).json({
            success:true,
            message:"Successfully retrived all user details",
            data:userDetails,
        })
    }catch(err){
        res.status(400).json({
            success:false,
            message:"Error in fetching user details"
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

exports.updateDisplayPicture = async (req, res) => {
  try {
    const displayPicture = req.files.displayPicture;
    const userId = req.user.id;

    const image = await imageUploader(
      displayPicture.tempFilePath,
      process.env.CLOUD_FOLDER,
      1000,
      1000
    );

    // Update image
    await User.findByIdAndUpdate(
      userId,
      { image: image.secure_url },
      { new: true }
    );

    // ✅ Fetch FULL populated user
    const updatedUser = await User.findById(userId)
      .populate("additionalDetails");

    res.status(200).json({
      success: true,
      message: "Image Updated Successfully",
      data: updatedUser,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


  exports.getEnrolledCourses = async (req, res) => {
    try {
      const userId = req.user.id
      let userDetails = await User.findOne({
        _id: userId,
      })
        .populate({
          path: "courses",
          populate: {
            path: "courseContent",
            populate: {
              path: "subSection",
            },
          },
        })
        .exec()
      userDetails = userDetails.toObject()
      var SubsectionLength = 0;

for (var i = 0; i < userDetails.courses.length; i++) {
  let totalDurationInSeconds = 0;
      SubsectionLength = 0;

      for (var j = 0; j < userDetails.courses[i].courseContent.length; j++) {
        totalDurationInSeconds += userDetails.courses[i].courseContent[j].subSection.reduce(
          (acc, curr) => {
            const parsed = parseInt(curr.timeDuration, 10);
            return !isNaN(parsed) ? acc + parsed : acc; // skip NaN duration
          },
          0
        );

        userDetails.courses[i].totalDuration = convertSecondsToDuration(
          totalDurationInSeconds
        );

        // Count subsections normally (even if some durations are invalid)
        SubsectionLength += userDetails.courses[i].courseContent[j].subSection.length;
      }

      let courseProgressCount = await CourseProgress.findOne({
        courseID: userDetails.courses[i]._id,
        userId: userId,
      });

      courseProgressCount = courseProgressCount?.completedVideos.length;

      if (SubsectionLength === 0) {
        userDetails.courses[i].progressPercentage = 100;
      } else {
        const multiplier = Math.pow(10, 2);
        userDetails.courses[i].progressPercentage =
          Math.round(
            (courseProgressCount / SubsectionLength) * 100 * multiplier
          ) / multiplier;
      }
    }

      
  
      if (!userDetails) {
        return res.status(400).json({
          success: false,
          message: `Could not find user with id: ${userDetails}`,
        })
      }
      return res.status(200).json({
        success: true,
        data: userDetails.courses,
      })
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: error.message,
      })
    }
  }

  exports.instructorDashboard = async (req, res) => {
    try {
      const courseDetails = await Course.find({ instructor: req.user.id })
  
      const courseData = courseDetails.map((course) => {
        const totalStudentsEnrolled = course?.studentsEnrolled?.length || 0;
        const totalAmountGenerated = totalStudentsEnrolled * course.price
  
        // Create a new object with the additional fields
        const courseDataWithStats = {
          _id: course._id,
          courseName: course.courseName,
          courseDescription: course.courseDescription,
          // Include other course properties as needed
          totalStudentsEnrolled,
          totalAmountGenerated,
        }
  
        return courseDataWithStats
      })
  
      res.status(200).json({ courses: courseData })
    } catch (error) {
      console.error(error)
      res.status(500).json({ message: "Server Error" })
    }
  }