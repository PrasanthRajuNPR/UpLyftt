import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { RxCross2 } from "react-icons/rx"
import { useSelector } from "react-redux"
import { createRating } from "../../../services/operations/courseDetailsAPI"
import IconBtn from "../../common/IconBtn"
import { useState } from "react"
import { TiStarFullOutline, TiStarHalfOutline, TiStarOutline } from "react-icons/ti"


function RatingInputStars({ size = 24, value = 0, onChange }) {
  const [rating, setRating] = useState(value)
  const [hover, setHover] = useState(0)

  const handleMouseMove = (event, index) => {
    const { left, width } = event.currentTarget.getBoundingClientRect()
    const x = event.clientX - left
    const isHalf = x < width / 2
    setHover(index - (isHalf ? 0.5 : 0))
  }

  const handleClick = (val) => {
    setRating(val)
    onChange && onChange(val)
  }

  const handleMouseLeave = () => setHover(0)

  return (
    <div className="flex gap-2 text-yellow-100 cursor-pointer" onMouseLeave={handleMouseLeave}>
      {[1, 2, 3, 4, 5].map((index) => {
        const displayValue = hover || rating
        let IconComponent
        let color

        if (displayValue >= index) {
          IconComponent = TiStarFullOutline
          color = "#22D3EE" 
        } else if (displayValue >= index - 0.5) {
          IconComponent = TiStarHalfOutline
          color = "#67E8F9" 
        } else {
          IconComponent = TiStarOutline
          color = "#3B82F6" 
        }

        return (
          <span
            key={index}
            onMouseMove={(e) => handleMouseMove(e, index)}
            onClick={() => handleClick(hover || index)}
            className="transition-all duration-300 hover:scale-125"
          >
            <IconComponent size={size} color={color} />
          </span>
        )
      })}
    </div>
  )
}

export default function CourseReviewModal({ setReviewModal }) {
  const { user } = useSelector((state) => state.profile)
  const { token } = useSelector((state) => state.auth)
  const { courseEntireData } = useSelector((state) => state.viewCourse)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      courseExperience: "",
      courseRating: 0,
    },
  })

  const courseRating = watch("courseRating")

  const onSubmit = async (data) => {
    await createRating(
      {
        courseId: courseEntireData._id,
        rating: data.courseRating,
        review: data.courseExperience,
      },
      token
    )
    setReviewModal(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-[#020617]/70">
      <div className="w-full max-w-lg rounded-[16px] bg-[#020617] p-8 border border-[#1E293B] shadow-md ">
        {/* Modal Header */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-2xl font-semibold text-[#E5E7EB]">Add Review</p>
          <button onClick={() => setReviewModal(false)} className="text-2xl text-[#E5E7EB] hover:text-[#22D3EE]">
            <RxCross2 />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-x-4 mb-4">
            <img
              src={user?.image}
              alt={`${user?.firstName}'s profile`}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div>
              <p className="text-lg font-semibold text-[#E5E7EB]">{user?.firstName} {user?.lastName}</p>
              <p className="text-sm text-[#CBD5E1]">Posting Publicly</p>
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col items-center space-y-6">
            {/* Half-Star Rating Input */}
            <div className="flex justify-center w-full">
              <RatingInputStars
                size={32}
                value={courseRating}
                onChange={(val) => setValue("courseRating", val)}
              />
            </div>

            <div className="w-full">
              <label htmlFor="courseExperience" className="text-sm text-[#CBD5E1] mb-2">
                Add Your Experience <span className="text-pink-200">*</span>
              </label>
              <textarea
                id="courseExperience"
                placeholder="Share your thoughts on the course..."
                {...register("courseExperience", { required: true })}
                className="w-full p-4 bg-[#1E293B] text-[#E5E7EB] rounded-lg border border-[#1E293B] placeholder-[#94A3B8] focus:outline-none focus:ring-2 focus:ring-[#22D3EE]"
              />
              {errors.courseExperience && (
                <span className="text-xs text-pink-200">Please add your experience.</span>
              )}
            </div>

            <div className="flex w-full justify-end gap-x-4">
              <button
                type="button"
                onClick={() => setReviewModal(false)}
                className="bg-[#3B82F6] py-2 px-6 rounded-md text-[#E5E7EB] hover:bg-[#67E8F9] transition-all"
              >
                Cancel
              </button>
              <IconBtn
                text="Save"
                type="submit"
                className="bg-[#22D3EE] text-[#020617] hover:shadow-lg hover:shadow-[#67E8F9] transition-all py-2 px-6 rounded-md"
              />
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
