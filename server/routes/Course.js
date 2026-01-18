const express = require("express");

const router = express.Router();
//course
const { createCourse,
        allCourses,
        getCourseDetails,
        editCourse,
        getFullCourseDetails,
        getInstructorCourses,
        deleteCourse    } = require("../Controllers/Course");

//category
const { createCategory,
        showAllCategories,
        categoryPageDetails }= require("../Controllers/category"); 

//rating and review
const { getAllRating,
        averageRating,
        createRating} = require("../Controllers/ratingAndReview");

//section
const { deleteSection,
        sectionUpdate,
        section} = require("../Controllers/Sections");

const {auth,isInstructor,isAdmin,isStudent} = require("../middlewares/auth");

//subSection
const { createSubSection,
        deleteSubSection,
        updateSubSection} = require("../Controllers/subSection");

//courseProgress
  
const {updateCourseProgress} = require("../Controllers/courseProgress")



//section routes
router.post("/createSection", auth, isInstructor,section);
router.post("/updateSection",auth, isInstructor,sectionUpdate);
router.post("/deleteSection", auth, isInstructor, deleteSection)

//subsection router

router.post("/createSubSection",createSubSection);
router.post("/deleteSubSection", auth, isInstructor, deleteSubSection)
router.post("/updateSubSection", auth, isInstructor, updateSubSection)

//course routes
router.post("/createCourse",auth,isInstructor,createCourse);

router.get("/allCourses",allCourses);

router.post("/getCourseDetails",getCourseDetails);

router.post("/getFullCourseDetails", auth, getFullCourseDetails)

router.post("/editCourse", auth, isInstructor, editCourse)

router.get("/getInstructorCourses", auth, isInstructor, getInstructorCourses)

router.delete("/deleteCourse", deleteCourse)

router.post("/updateCourseProgress", auth, isStudent, updateCourseProgress);


//category routes
router.post("/createCategory",auth,isAdmin,createCategory);

router.get("/showAllCategories",showAllCategories);

router.post("/categoryPageDetails",categoryPageDetails);

//rating routes 

router.post("/createRating",auth,isStudent,createRating);

router.get("/averageRating",auth,averageRating);

router.get("/getAllRating",getAllRating);

module.exports = router;