const Section = require("../models/Section");

const Course = require("../models/Course");

exports.section = async (req,res)=>{
    try{
        const {sectionName,courseId} = req.body;
        console.log("sec name: : ",sectionName)
        const newSection = await Section.create({sectionName});
        console.log("new sec : :",newSection._id)
        const updatedCourse = await Course.findByIdAndUpdate(courseId,
                                                             {
                                                                $push:{
                                                                    courseContent:newSection._id
                                                                }
                                                             },
                                                             {new:true})
                                                             .populate({
                                                                path:"courseContent"
                                                             })
                                                             .exec();
                                                             console.log("updated course :: ",updatedCourse)
        res.status(200).json({
            success:true,
            message:"section created Successfully",
            data:updatedCourse
        })
    }catch(err){
        res.status(400).json({
            success:false,
            message:err.message
        })
    }
}
exports.sectionUpdate = async (req, res) => {
  try {
    const { sectionName, sectionId, courseId } = req.body;

    if (!sectionName || !sectionId || !courseId) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // 1️⃣ Update the section name
    await Section.findByIdAndUpdate(
      sectionId,
      { sectionName },
      { new: true }
    );

    // 2️⃣ Fetch the UPDATED COURSE with populated sections & subsections
    const updatedCourse = await Course.findById(courseId).populate({
      path: "courseContent",
      populate: {
        path: "subSection",
      },
    });

    // 3️⃣ Return the full course (IMPORTANT)
    return res.status(200).json({
      success: true,
      data: updatedCourse,
    });

  } catch (err) {
    return res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};


exports.deleteSection = async (req, res) => {
  try {
    const { sectionId, courseId } = req.body;

    if (!sectionId || !courseId) {
      return res.status(400).json({
        success: false,
        message: "SectionId and CourseId are required",
      });
    }

    // 1️⃣ Remove section reference from course
    await Course.findByIdAndUpdate(courseId, {
      $pull: { courseContent: sectionId },
    });

    // 2️⃣ Delete the section itself
    await Section.findByIdAndDelete(sectionId);

    // 3️⃣ Return updated course
    const updatedCourse = await Course.findById(courseId).populate({
      path: "courseContent",
      populate: {
        path: "subSection",
      },
    });

    return res.status(200).json({
      success: true,
      data: updatedCourse,
      message: "Section deleted successfully",
    });

  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
