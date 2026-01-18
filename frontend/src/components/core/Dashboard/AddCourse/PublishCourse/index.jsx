import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { CheckCircle } from "lucide-react"

import { editCourseDetails } from "../../../../../services/operations/courseDetailsAPI"
import { resetCourseState, setStep } from "../../../../../redox/slices/courseSlice"
import { COURSE_STATUS } from "../../../../../utils/constants"

export default function PublishCourse() {
  const { register, setValue, getValues } = useForm()
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { token } = useSelector((state) => state.auth)
  const { course } = useSelector((state) => state.course)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (course?.status === COURSE_STATUS.PUBLISHED) {
      setValue("public", true)
    }
  }, [])

  const goBack = () => {
    dispatch(setStep(2))
  }

  const goToCourses = () => {
    dispatch(resetCourseState())
    navigate("/dashboard/my-courses")
  }

  const handlePublish = async () => {
    if (
      (course?.status === COURSE_STATUS.PUBLISHED && getValues("public") === true) ||
      (course?.status === COURSE_STATUS.DRAFT && getValues("public") === false)
    ) {
      goToCourses()
      return
    }

    const formData = new FormData()
    formData.append("courseId", course._id)
    const courseStatus = getValues("public")
      ? COURSE_STATUS.PUBLISHED
      : COURSE_STATUS.DRAFT
    formData.append("status", courseStatus)

    setLoading(true)
    const result = await editCourseDetails(formData, token)
    if (result) {
      goToCourses()
    }
    setLoading(false)
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 text-center space-y-6">
      <CheckCircle className="w-16 h-16 text-cyan-400 mx-auto" />
      <h2 className="text-2xl font-bold text-white">Ready to Publish</h2>
      <p className="text-gray-400 max-w-md mx-auto">
        Your course is ready! Click the button below to publish it and make it available to students.
      </p>

      {/* Optional Checkbox for public/private */}
      <div className="my-4">
        <label className="inline-flex items-center text-lg">
          <input
            type="checkbox"
            {...register("public")}
            className="border-gray-300 h-4 w-4 rounded bg-richblack-500 text-richblack-400 focus:ring-2 focus:ring-richblack-5"
          />
          <span className="ml-2 text-gray-300">
            Make this course public
          </span>
        </label>
      </div>

      <div className="flex justify-center space-x-4 pt-4">
        <button
          onClick={goBack}
          className="px-6 py-3 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
        >
          Back to Course Builder
        </button>

        <button
          onClick={handlePublish}
          disabled={loading}
          className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Publishing..." : "Publish Course"}
        </button>
      </div>
    </div>
  )
}
