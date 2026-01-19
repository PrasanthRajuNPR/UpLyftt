import React, { useEffect, useState } from "react"
import { Star, Users, Calendar, Globe } from 'lucide-react';
import ReactMarkdown  from "react-markdown"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"
import { motion } from 'framer-motion';
import ConfirmationModal from "../components/common/ConfirmationModal"
import CourseAccordionBar from "../components/core/Course/CourseAccordionBar"
import CourseDetailsCard from "../components/core/Course/CourseDetailsCard"
import { fetchCourseDetails } from "../services/operations/courseDetailsAPI"
import { buyCourse } from "../services/operations/studentFeaturesAPI"
import GetAvgRating from "../utils/avgRating"
import Error from "./Error"
function CourseDetails() {
  const { user } = useSelector((state) => state.profile)
  const { token } = useSelector((state) => state.auth)
  const { loading } = useSelector((state) => state.profile)
  const { paymentLoading } = useSelector((state) => state.course)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { courseId } = useParams()
  const [response, setResponse] = useState(null)
  const [confirmationModal, setConfirmationModal] = useState(null)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await fetchCourseDetails(courseId)
        setResponse(res)
      } catch (error) {
        console.log("Could not fetch Course Details")
      }
    })()
  }, [courseId])

  const [avgReviewCount, setAvgReviewCount] = useState(0)
  useEffect(() => {
    console.log("hurry : ",response?.data?.courseDetails)
    console.log("Users : ",user);
    const count = GetAvgRating(response?.data?.courseDetails.ratingAndReview)
    setAvgReviewCount(count)
  }, [response])

  const [totalNoOfLectures, setTotalNoOfLectures] = useState(0)
  useEffect(() => {
    let lectures = 0
    response?.data?.courseDetails?.courseContent?.forEach((sec) => {
      lectures += sec.subSection.length || 0
    })
    setTotalNoOfLectures(lectures)
  }, [response])

  if (loading || !response) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#020617]">
      {/* Card Container */}
      <div className="relative p-12 bg-[#020617]  rounded-2xl shadow-2xl overflow-hidden group">
        
        {/* Subtle Ambient Glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#3B82F6]/5 to-[#22D3EE]/5 opacity-0  transition-opacity duration-500" />

        <div className="relative flex flex-col items-center gap-6">
          <div className="relative w-20 h-20">
            {/* Outer Ring (Primary Accent) */}
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#22D3EE] border-l-[#22D3EE]/30"
              animate={{ rotate: 360 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{
                filter: "drop-shadow(0 0 8px #67E8F9)"
              }}
            />

            {/* Inner Ring (Secondary Accent) */}
            <motion.div
              className="absolute inset-2 rounded-full border-4 border-transparent border-b-[#3B82F6] border-r-[#3B82F6]/20"
              animate={{ rotate: -360 }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear"
              }}
            />

            {/* Center Core Dot */}
            <div className="absolute inset-0 m-auto w-2 h-2 bg-[#67E8F9] rounded-full shadow-[0_0_15px_#67E8F9]" />
          </div>

          {/* Loading Text */}
          <span className="text-sm font-medium tracking-widest text-[#22D3EE] uppercase animate-pulse">
            Loading {<div className="mt-8 flex gap-2 justify-center">
          <div
            className="w-2 h-2 bg-[#22D3EE] rounded-full animate-bounce-dot"
            style={{ animationDelay: "0s" }}
          ></div>
          <div
            className="w-2 h-2 bg-[#3B82F6] rounded-full animate-bounce-dot"
            style={{ animationDelay: "0.2s" }}
          ></div>
          <div
            className="w-2 h-2 bg-[#67E8F9] rounded-full animate-bounce-dot"
            style={{ animationDelay: "0.4s" }}
          ></div>
        </div>}
            
          </span>
        </div>
      </div>
    </div>
    )
  }

  if (!response.success) {
    return <Error />
  }

  const {
    _id: course_id,
    courseName,
    courseDescription,
    thumbnail,
    price,
    whatYouWillLearn,
    courseContent,
    ratingAndReviews,
    instructor,
    studentsEnrolled,
    createdAt,
  } = response.data?.courseDetails

  const handleBuyCourse = () => {
    if (token) {
      buyCourse(token, [courseId], user, navigate, dispatch)
      return
    }
    setConfirmationModal({
      text1: "You are not logged in!",
      text2: "Please login to Purchase Course.",
      btn1Text: "Login",
      btn2Text: "Cancel",
      btn1Handler: () => navigate("/login"),
      btn2Handler: () => setConfirmationModal(null),
    })
  }

  if (paymentLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#020617]">
      {/* Card Container */}
      <div className="relative p-12 bg-[#020617]  rounded-2xl shadow-2xl overflow-hidden group">
        
        {/* Subtle Ambient Glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#3B82F6]/5 to-[#22D3EE]/5 opacity-0  transition-opacity duration-500" />

        <div className="relative flex flex-col items-center gap-6">
          <div className="relative w-20 h-20">
            {/* Outer Ring (Primary Accent) */}
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#22D3EE] border-l-[#22D3EE]/30"
              animate={{ rotate: 360 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{
                filter: "drop-shadow(0 0 8px #67E8F9)"
              }}
            />

            {/* Inner Ring (Secondary Accent) */}
            <motion.div
              className="absolute inset-2 rounded-full border-4 border-transparent border-b-[#3B82F6] border-r-[#3B82F6]/20"
              animate={{ rotate: -360 }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear"
              }}
            />

            {/* Center Core Dot */}
            <div className="absolute inset-0 m-auto w-2 h-2 bg-[#67E8F9] rounded-full shadow-[0_0_15px_#67E8F9]" />
          </div>

          {/* Loading Text */}
          <span className="text-sm font-medium tracking-widest text-[#22D3EE] uppercase animate-pulse">
            Loading {<div className="mt-8 flex gap-2 justify-center">
          <div
            className="w-2 h-2 bg-[#22D3EE] rounded-full animate-bounce-dot"
            style={{ animationDelay: "0s" }}
          ></div>
          <div
            className="w-2 h-2 bg-[#3B82F6] rounded-full animate-bounce-dot"
            style={{ animationDelay: "0.2s" }}
          ></div>
          <div
            className="w-2 h-2 bg-[#67E8F9] rounded-full animate-bounce-dot"
            style={{ animationDelay: "0.4s" }}
          ></div>
        </div>}
            
          </span>
        </div>
      </div>
    </div>
    )
  }

  return (
    <>
      <div className="relative w-full bg-richblack-800">
        {/* Hero Section (New Design) */}
       <div className="mx-auto box-content px-10 lg:w-[1260px] 2xl:relative">
  <div className="mx-auto grid min-h-[450px] max-w-maxContentTab justify-items-center py-8 lg:mx-0 lg:justify-items-start lg:py-0 xl:max-w-[810px]">

    {/* Mobile Thumbnail */}
    <div className="relative block max-h-[30rem] lg:hidden">
      <div className="absolute bottom-0 left-0 h-full w-full shadow-[#161D29_0px_-64px_36px_-28px_inset]"></div>
      <img
        src={thumbnail}
        alt="course thumbnail"
        className="aspect-auto w-full"
      />
    </div>

    {/* Text Content */}
    <div className="z-30 flex flex-col justify-center gap-4 text-lg text-[#E5E7EB]">
      
      {/* Course Name */}
      <h1
        className="text-4xl sm:text-[42px] font-bold leading-tight"
        style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}
      >
        {courseName}
      </h1>

      {/* Course Description */}
      <p
        className="text-lg text-[#94A3B8] leading-relaxed"
        style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 400 }}
      >
        {courseDescription}
      </p>

      {/* Info Bar */}
      <div className="flex flex-wrap items-center gap-6 text-sm">
        {/* Avg Review */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Star className="w-5 h-5 fill-[#22D3EE] text-[#22D3EE]" />
            <span
              className="text-[#E5E7EB] font-semibold text-base"
              style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}
            >
              {avgReviewCount}
            </span>
          </div>
          <span
            className="text-[#94A3B8]"
            style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 400 }}
          >
            ({ratingAndReviews.length} reviews)
          </span>
        </div>

        {/* Students */}
        <div className="flex items-center gap-2 text-[#94A3B8]" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 400 }}>
          <Users className="w-5 h-5 text-[#22D3EE]" />
          <span>{studentsEnrolled.length} students</span>
        </div>

        {/* Created Date */}
        <div className="flex items-center gap-2 text-[#94A3B8]" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 400 }}>
          <Calendar className="w-5 h-5 text-[#22D3EE]" />
          <span>Created {new Date(createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
        </div>

        {/* Language */}
        <div className="flex items-center gap-2 text-[#94A3B8]" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 400 }}>
          <Globe className="w-5 h-5 text-[#22D3EE]" />
          <span>English</span>
        </div>
      </div>

      {/* Instructor */}
      <div className="flex items-center gap-3 pt-2">
        <span
          className="text-[#CBD5E1] text-sm"
          style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 400 }}
        >
          Instructor:
        </span>
        <span
          className="text-[#22D3EE]"
          style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 500 }}
        >
          {`${instructor.firstName} ${instructor.lastName}`}
        </span>
      </div>
    </div>
  </div>

  {/* Desktop Course Card */}
{/* Mobile Card */}
<div className="block lg:hidden mx-auto w-full max-w-[400px] mt-6">
  <CourseDetailsCard
    course={response?.data?.courseDetails}
    setConfirmationModal={setConfirmationModal}
    handleBuyCourse={handleBuyCourse}
    mobile={true}
  />
</div>

{/* Desktop Card */}
<div className="hidden lg:block right-[1rem] top-[60px] min-h-[600px] w-1/3 max-w-[410px] lg:absolute">
  <CourseDetailsCard
    course={response?.data?.courseDetails}
    setConfirmationModal={setConfirmationModal}
    handleBuyCourse={handleBuyCourse}
    mobile={false}
  />
</div>


        </div>

      </div>

      {/* What You'll Learn & Content */}
      <div className="mx-auto box-content px-4 text-start text-richblack-5 lg:w-[1260px]">
        <div className="mx-auto max-w-maxContentTab lg:mx-0 xl:max-w-[810px]">
          {/* What will you learn section */}
         <div
            className="bg-[#020617] border border-[#1E293B] rounded-2xl p-8 transition-all duration-300 hover:border-[#22D3EE]/30 hover:shadow-[0_0_20px_rgba(34,211,238,0.1)]"
            style={{ fontFamily: "'Poppins', sans-serif" }}
          >
            <h2
              className="text-2xl font-bold text-[#E5E7EB] mb-6"
              style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}
            >
              What You'll Learn
            </h2>
            <div
              className="text-[#94A3B8] leading-relaxed space-y-3"
              style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 400 }}
            >
              <ReactMarkdown>{whatYouWillLearn}</ReactMarkdown>
            </div>
          </div>


          {/* Course Content Section */}
          <div className="max-w-[830px] mt-6">
            <CourseAccordionBar courseContent={courseContent} />

            {/* Author Details */}
            <div
              className="bg-[#020617] border border-[#1E293B] rounded-2xl p-8 transition-all duration-300 hover:border-[#22D3EE]/30 hover:shadow-[0_0_20px_rgba(34,211,238,0.1)] mt-6"
              style={{ fontFamily: "'Poppins', sans-serif" }}
            >
              {/* Section Heading */}
              <h2
                className="text-2xl font-bold text-[#E5E7EB] mb-6"
                style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}
              >
                Your Instructor
              </h2>

              <div className="flex gap-6 items-start">
                {/* Instructor Image */}
                <img
                  src={
                    instructor.image
                      ? instructor.image
                      : `https://api.dicebear.com/5.x/initials/svg?seed=${instructor.firstName} ${instructor.lastName}`
                  }
                  alt={`${instructor.firstName} ${instructor.lastName}`}
                  className="w-24 h-24 rounded-full object-cover border-2 border-[#22D3EE]/30"
                />

                {/* Instructor Info */}
                <div className="flex-1">
                  {/* Name */}
                  <h3
                    className="text-xl font-semibold text-[#CBD5E1] mb-3"
                    style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 600 }}
                  >
                    {`${instructor.firstName} ${instructor.lastName}`}
                  </h3>

                  {/* About */}
                  <p
                    className="text-[#94A3B8] leading-relaxed"
                    style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 400 }}
                  >
                    {instructor?.additionalDetails?.about}
                  </p>
                </div>
              </div>
            </div>


          </div>
        </div>
      </div>
      {confirmationModal && <ConfirmationModal modalData={confirmationModal} />}
    </>
  )
}

export default CourseDetails
