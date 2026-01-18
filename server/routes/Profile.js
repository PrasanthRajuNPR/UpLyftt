const express = require("express");

const router = express.Router();

const { getAllUserDetails,
        deleteAccount,
        updateProfile,
        updateDisplayPicture,
        getEnrolledCourses,
        instructorDashboard} = require("../Controllers/Profile");

const {auth,isInstructor} = require("../middlewares/auth");

router.put("/updateProfile",auth,updateProfile);

router.get("/getUserDetails",auth,getAllUserDetails);



router.delete("/deleteProfile", auth, deleteAccount)   

// Get Enrolled Courses
router.get("/getEnrolledCourses", auth, getEnrolledCourses)
router.put("/updateDisplayPicture", auth, updateDisplayPicture)
router.get("/instructorDashboard", auth, isInstructor, instructorDashboard)

module.exports = router;
     