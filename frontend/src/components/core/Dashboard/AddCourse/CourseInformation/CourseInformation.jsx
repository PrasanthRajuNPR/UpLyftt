import { useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useLocation } from "react-router-dom"
import { toast } from "react-hot-toast"
import { X, Plus, Image as ImageIcon } from "lucide-react"

import {
  addCourseDetails,
  editCourseDetails,
  fetchCourseCategories,
} from "../../../../../services/operations/courseDetailsAPI"
import { setCourse, setStep } from "../../../../../redox/slices/courseSlice"
import { COURSE_STATUS } from "../../../../../utils/constants"

/* ---------------- UTILS ---------------- */
const normalizeArray = (val) => {
  if (Array.isArray(val)) {
    if (
      val.length === 1 &&
      typeof val[0] === "string" &&
      val[0].trim().startsWith("[")
    ) {
      try {
        const parsed = JSON.parse(val[0])
        if (Array.isArray(parsed)) return parsed
      } catch {
        return val
      }
    }
    return val
  }

  if (typeof val === "string") {
    try {
      const parsed = JSON.parse(val)
      if (Array.isArray(parsed)) return parsed
    } catch {
      return val.split(",").map(v => v.trim()).filter(Boolean)
    }
  }

  return []
}


const categoriesFallback = [
  "Web Development",
  "Data Science",
  "AI & Machine Learning",
  "Cyber Security",
  "Cloud Computing",
  "Mobile Development",
  "Game Development",
  "DevOps",
]

export default function CourseInformationForm() {
  /* ---------------- RHF ---------------- */
  const { register, handleSubmit, setValue, getValues } = useForm()

  /* ---------------- ROUTER / REDUX ---------------- */
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  const goToStage2 = (courseData) => {
    dispatch(setCourse(courseData))
    dispatch(setStep(2))         
  }
  const { token } = useSelector((state) => state.auth)
  const { course, editCourse } = useSelector((state) => state.course)

  /* ---------------- UI STATE ---------------- */
  const [courseCategories, setCourseCategories] = useState([])
  const [loading, setLoading] = useState(false)

  const [tags, setTags] = useState([])
  const [tagInput, setTagInput] = useState("")

  const [benefits, setBenefits] = useState("")

  const [requirements, setRequirements] = useState([])
  const [requirementInput, setRequirementInput] = useState("")

  const [thumbnail, setThumbnail] = useState("")
  const [thumbnailDragActive, setThumbnailDragActive] = useState(false)

  const thumbnailInputRef = useRef(null)

  /* ---------------- INITIAL LOAD + RERENDER FIX ---------------- */
  useEffect(() => {
    const loadCategories = async () => {
      setLoading(true)
      const res = await fetchCourseCategories()
      setCourseCategories(res || [])
      setLoading(false)
    }

    if (editCourse && course) {
      const tagArr = normalizeArray(course.tag)
      const reqArr = normalizeArray(course.instructions)

      setValue("courseTitle", course.courseName)
      setValue("courseShortDesc", course.courseDescription)
      setValue("coursePrice", course.price)
      setValue("courseCategory", course.category?._id)

      setTags(tagArr)
      console.log("Tagssssssssssss : ",tagArr)
      setRequirements(reqArr)
      setBenefits(course.whatYouWillLearn || "")
      setThumbnail(course.thumbnail || "")

      setValue("courseTags", tagArr)
      setValue("courseRequirements", reqArr)
      setValue("courseBenefits", course.whatYouWillLearn || "")
      setValue("courseImage", course.thumbnail || "")
    } else {
      setTags([])
      setRequirements([])
      setBenefits("")
      setThumbnail("")
    }

    loadCategories()
  }, [location.key]) 

  /* ---------------- SYNC LOCAL → RHF ---------------- */
  useEffect(() => setValue("courseTags", tags), [tags])
  useEffect(() => setValue("courseBenefits", benefits), [benefits])
  useEffect(() => setValue("courseRequirements", requirements), [requirements])

  /* ---------------- EDIT CHECK ---------------- */
  const isFormUpdated = () => {
    const v = getValues()
    return (
      v.courseTitle !== course.courseName ||
      v.courseShortDesc !== course.courseDescription ||
      v.coursePrice !== course.price ||
      JSON.stringify(v.courseTags) !== JSON.stringify(normalizeArray(course.tag)) ||
      v.courseBenefits !== course.whatYouWillLearn ||
      v.courseCategory !== course.category._id ||
      JSON.stringify(v.courseRequirements) !==
        JSON.stringify(normalizeArray(course.instructions)) ||
      v.courseImage !== course.thumbnail
    )
  }

  /* ---------------- TAGS ---------------- */
  const handleTagAdd = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault()
      setTags([...tags, tagInput.trim()])
      setTagInput("")
    }
  }

  /* ---------------- REQUIREMENTS ---------------- */
  const handleRequirementAdd = () => {
    if (requirementInput.trim()) {
      setRequirements([...requirements, requirementInput.trim()])
      setRequirementInput("")
    }
  }

  /* ---------------- THUMBNAIL ---------------- */
  const handleThumbnailFile = (file) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      setThumbnail(reader.result)
      setValue("courseImage", file)
    }
    reader.readAsDataURL(file)
  }

  const handleThumbnailDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setThumbnailDragActive(false)
    const file = e.dataTransfer.files[0]
    if (file) handleThumbnailFile(file)
  }

  /* ---------------- SUBMIT ---------------- */
  const onSubmit = async (data) => {
    if (editCourse && !isFormUpdated()) {
      toast.error("No changes made to the form")
      return
    }

    const formData = new FormData()
    formData.append("courseName", data.courseTitle)
    formData.append("courseDescription", data.courseShortDesc)
    formData.append("price", data.coursePrice)
    formData.append("category", data.courseCategory)
    formData.append("tag", JSON.stringify(data.courseTags))
    formData.append("whatYouWillLearn", data.courseBenefits)
    formData.append("instructions", JSON.stringify(data.courseRequirements))
    formData.append("thumbnailImage", data.courseImage)

    if (editCourse) {
      formData.append("courseId", course._id)
    } else {
      formData.append("status", COURSE_STATUS.DRAFT)
    }

    setLoading(true)
    const result = editCourse
      ? await editCourseDetails(formData, token)
      : await addCourseDetails(formData, token)
    setLoading(false)

    if (!result) {
      toast.error("Failed to save course")
      return
    }
    console.log("Result 1 : ",result)
    console.log("Result 2 : ",result.data)
    dispatch(setCourse(editCourse ? result : result))
    dispatch(setStep(2))
  }

  /* ---------------- UI (UNCHANGED) ---------------- */
  return (
  <form onSubmit={handleSubmit(onSubmit)} className="max-w-4xl mx-auto">
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 space-y-6">

      {/* COURSE TITLE */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Course Title
        </label>
        <input
          {...register("courseTitle", { required: true })}
          placeholder="e.g., Complete Web Development Bootcamp"
          className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />
      </div>

      {/* COURSE DESCRIPTION */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Course Description
        </label>
        <textarea
          {...register("courseShortDesc", { required: true })}
          rows={4}
          placeholder="Describe what students will learn..."
          className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
        />
      </div>

      {/* PRICE + CATEGORY */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Price ($)
          </label>
          <input
            {...register("coursePrice", { required: true })}
            type="number"
            step="0.01"
            placeholder="49.99"
            className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 text-white"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Category
          </label>
          <select
            {...register("courseCategory", { required: true })}
            className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 text-white"
          >
            <option value="">Select Category</option>
            {(courseCategories.length
              ? courseCategories
              : categoriesFallback
            ).map((cat) => (
              <option key={cat._id || cat} value={cat._id || cat}>
                {cat.name || cat}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* COURSE THUMBNAIL */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Course Thumbnail
        </label>
        <div
          onDragEnter={() => setThumbnailDragActive(true)}
          onDragLeave={() => setThumbnailDragActive(false)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleThumbnailDrop}
          className={`border-2 border-dashed rounded-lg p-8 text-center transition-all ${
            thumbnailDragActive
              ? "border-cyan-400 bg-cyan-500/10"
              : thumbnail
              ? "border-gray-700 bg-gray-950"
              : "border-gray-700 bg-gray-950 hover:border-cyan-400/50 hover:bg-cyan-500/5"
          }`}
        >
          <input
            ref={thumbnailInputRef}
            type="file"
            hidden
            accept="image/*"
            onChange={(e) => handleThumbnailFile(e.target.files[0])}
          />

          {thumbnail ? (
            <div className="space-y-4">
              <img
                src={thumbnail}
                alt="Course thumbnail preview"
                className="w-full h-40 object-cover rounded-lg"
              />
              <div className="flex space-x-2 justify-center">
                <button
                  type="button"
                  onClick={() => thumbnailInputRef.current.click()}
                  className="px-4 py-2 text-cyan-400 hover:text-cyan-300 transition-colors text-sm"
                >
                  Replace Image
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setThumbnail("")
                    setValue("courseImage", null)
                  }}
                  className="px-4 py-2 text-red-400 hover:text-red-300 transition-colors text-sm"
                >
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-center">
                <div className="p-3 bg-cyan-500/10 rounded-lg">
                  <ImageIcon className="w-8 h-8 text-cyan-400" />
                </div>
              </div>
              <div>
                <p className="text-white font-medium mb-1">
                  Upload Course Thumbnail
                </p>
                <p className="text-gray-400 text-sm mb-3">
                  Drag and drop your image here, or click to select
                </p>
              </div>
              <button
                type="button"
                onClick={() => thumbnailInputRef.current.click()}
                className="px-6 py-2 bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-all text-sm font-medium"
              >
                Browse Files
              </button>
            </div>
          )}
        </div>
      </div>

      {/* TAGS */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Tags
        </label>
        <input
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleTagAdd}
          placeholder="Type and press Enter to add tags"
          className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 text-white"
        />
        <div className="flex flex-wrap gap-2 mt-3">
          {tags.map((tag, i) => (
            <span
              key={i}
              className="inline-flex items-center space-x-2 px-3 py-1 bg-cyan-500/10 border border-cyan-500/50 rounded-full text-cyan-400"
            >
              <span>{tag}</span>
              <button
                type="button"
                onClick={() =>
                  setTags(tags.filter((_, idx) => idx !== i))
                }
              >
                <X className="w-4 h-4" />
              </button>
            </span>
          ))}
        </div>
      </div>

      {/* BENEFITS */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Benefits
        </label>
        <textarea
          value={benefits}
          onChange={(e) => setBenefits(e.target.value)}
          rows={4}
          placeholder="Add each benefit on a new line"
          className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 text-white resize-none"
        />
      </div>

      {/* REQUIREMENTS */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Requirements
        </label>
        <div className="flex space-x-2">
          <input
            value={requirementInput}
            onChange={(e) => setRequirementInput(e.target.value)}
            placeholder="Add requirement"
            className="flex-1 bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 text-white"
          />
          <button
            type="button"
            onClick={handleRequirementAdd}
            className="px-4 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
        <div className="space-y-2 mt-3">
          {requirements.map((req, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-4 py-2 bg-gray-950 border border-gray-800 rounded-lg"
            >
              <span className="text-gray-300">{req}</span>
              <button
                type="button"
                onClick={() =>
                  setRequirements(
                    requirements.filter((_, idx) => idx !== i)
                  )
                }
                className="text-red-400 hover:text-red-300"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ACTION BUTTONS */}
      <div className="flex justify-end gap-3 pt-4">
        {editCourse && (
          <button
            type="button"
            onClick={() => {
              dispatch(setStep(2))
            }}
            disabled={loading}
            className="px-6 py-3 rounded-md bg-gray-300 text-gray-900 font-semibold"
          >
            Continue Without Saving
          </button>
        )}
        <button
          disabled={loading}
          className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold disabled:opacity-50"
        >
          Next: Course Builder
        </button>
      </div>
    </div>
  </form>
)

}
