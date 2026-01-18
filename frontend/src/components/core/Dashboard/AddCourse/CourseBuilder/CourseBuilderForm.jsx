import { useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { MdNavigateNext } from "react-icons/md"
import { useDispatch, useSelector } from "react-redux"

import {
  createSection,
  updateSection,
} from "../../../../../services/operations/courseDetailsAPI"
import {
  setCourse,
  setEditCourse,
  setStep,
} from "../../../../../redox/slices/courseSlice"
import NestedView from "./NestedView"

export default function CourseBuilderForm() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm()

  const { course } = useSelector((state) => state.course)
  const { token } = useSelector((state) => state.auth)

  const [loading, setLoading] = useState(false)
  const [editSectionName, setEditSectionName] = useState(null)

  const dispatch = useDispatch()

  const onSubmit = async (data) => {
    setLoading(true)
    let result

    if (editSectionName) {
      result = await updateSection(
        {
          sectionName: data.sectionName,
          sectionId: editSectionName,
          courseId: course._id,
        },
        token
      )
    } else {
      result = await createSection(
        {
          sectionName: data.sectionName,
          courseId: course._id,
        },
        token
      )
    }

    if (result) {
      dispatch(setCourse(result))
      setEditSectionName(null)
      setValue("sectionName", "")
    }

    setLoading(false)
  }

  const cancelEdit = () => {
    setEditSectionName(null)
    setValue("sectionName", "")
  }

  const handleChangeEditSectionName = (sectionId, sectionName) => {
    if (editSectionName === sectionId) {
      cancelEdit()
      return
    }
    setEditSectionName(sectionId)
    setValue("sectionName", sectionName)
  }

  const goToNext = () => {
    if (course?.courseContent?.length === 0) {
      toast.error("Please add atleast one section")
      return
    }

    if (
      course.courseContent.some(
        (section) => section?.subSection?.length === 0
      )
    ) {
      toast.error("Please add atleast one lecture in each section")
      return
    }

    dispatch(setStep(3))
  }

  const goBack = () => {
    dispatch(setStep(1))
    dispatch(setEditCourse(true))
  }

  return (
    <div className="bg-gray-900 border border-gray-800 rounded-lg p-8 space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Section Name
        </label>

        <form onSubmit={handleSubmit(onSubmit)} className="flex space-x-2">
          <input
            disabled={loading}
            placeholder="e.g., Introduction to JavaScript"
            {...register("sectionName", { required: true })}
            className="flex-1 bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors font-semibold"
          >
            {editSectionName ? "Update Section" : "Create Section"}
          </button>
        </form>

        {errors.sectionName && (
          <p className="text-sm text-red-400 mt-1">
            Section name is required
          </p>
        )}

        {editSectionName && (
          <button
            onClick={cancelEdit}
            className="mt-2 text-sm text-gray-400 hover:text-white underline"
          >
            Cancel Edit
          </button>
        )}
      </div>

      {course?.courseContent?.length > 0 && (
        <NestedView handleChangeEditSectionName={handleChangeEditSectionName} />
      )}

      <div className="flex justify-between pt-4">
        <button
          onClick={goBack}
          className="px-6 py-3 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
        >
          Back to Course Info
        </button>

        <button
          onClick={goToNext}
          disabled={loading}
          className="flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all"
        >
          Next
          <MdNavigateNext />
        </button>
      </div>
    </div>
  )
}
