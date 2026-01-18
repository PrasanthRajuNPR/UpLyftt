const SubSection = require("../models/SubSection");

const Section = require("../models/Section");

const imageUploader = require("../utils/imageUploader");

require("dotenv").config();

exports.createSubSection = async (req,res)=>{
    try{
        const {title,description,sectionId} = req.body;
 
        const file = req.files.video;

        if(!file || !description || !title || !file){
            return res.status(400).json({
                success:true,
                message:"All feilds required"
            })
        }

        console.log("Title : ",title,"Description : ",description,"Video : ",file);

        const videoUpload = await imageUploader(file.tempFilePath,process.env.CLOUD_FOLDER);

        console.log(videoUpload)

        const newSubSection = await SubSection.create({
            title:title,
            description:description,
            videoUrl:videoUpload.secure_url,
             timeDuration: `${videoUpload.duration}`,
        });

        const updateSection = await Section.findByIdAndUpdate({_id:sectionId},
                                                              {
                                                                $push:{
                                                                    subSection:newSubSection
                                                                }
                                                              },
                                                              {new:true})
                                                              .populate("subSection")
        
        res.status(200).json({
            success:true,
            message:"New subsection created",
            data:updateSection
        })
    }catch(err){
        res.status(400).json({
            success:false,
            message:"error occured while creating subSection",
            error:err.message
        })
    }
}


exports.updateSubSection = async (req, res) => {
    try {
      const { sectionId, subSectionId, title, description } = req.body
      const subSection = await SubSection.findById(subSectionId)
  
      if (!subSection) {
        return res.status(404).json({
          success: false,
          message: "SubSection not found",
        })
      }
  
      if (title !== undefined) {
        subSection.title = title
      }
  
      if (description !== undefined) {
        subSection.description = description
      }
      if (req.files && req.files.video !== undefined) {
        const video = req.files.video
              console.log("SubSection hurray 11111 ")

        const uploadDetails = await imageUploader(
          video,
          process.env.CLOUD_FOLDER
        )
        subSection.videoUrl = uploadDetails.secure_url
        subSection.timeDuration = `${uploadDetails.duration}`
      }
        console.log("SubSection hurray 22222")

      await subSection.save()
  
      // find updated section and return it
      const updatedSection = await Section.findById(sectionId).populate(
        "subSection"
      )
  
      console.log("updated section", updatedSection)
  
      return res.json({
        success: true,
        message: "Section updated successfully",
        data: updatedSection,
      })
    } catch (error) {
      console.error(error)
      return res.status(500).json({
        success: false,
        message: "An error occurred while updating the section",
      })
    }
  }
  
  
exports.deleteSubSection = async (req, res) => {
  try {
    const { subSectionId, sectionId } = req.body
    await Section.findByIdAndUpdate(
      { _id: sectionId },
      {
        $pull: {
          subSection: subSectionId,
        },
      }
    )
    const subSection = await SubSection.findByIdAndDelete({ _id: subSectionId })

    if (!subSection) {
      return res
        .status(404)
        .json({ success: false, message: "SubSection not found" })
    }

    // find updated section and return it
    const updatedSection = await Section.findById(sectionId).populate(
      "subSection"
    )

    return res.json({
      success: true,
      message: "SubSection deleted successfully",
      data: updatedSection,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      success: false,
      message: "An error occurred while deleting the SubSection",
    })
  }
}