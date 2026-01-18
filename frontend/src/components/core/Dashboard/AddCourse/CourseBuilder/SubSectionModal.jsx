import { useEffect, useRef, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-hot-toast"
import { RxCross2 } from "react-icons/rx"
import { Video } from "lucide-react"

import {
  createSubSection,
  updateSubSection,
} from "../../../../../services/operations/courseDetailsAPI"
import { setCourse } from "../../../../../redox/slices/courseSlice"

export default function SubSectionModal({
  modalData,
  setModalData,
  add = false,
  edit = false,
  view = false,
}) {
  const dispatch = useDispatch()
  const { token } = useSelector((state) => state.auth)
  const { course } = useSelector((state) => state.course)

  const [loading, setLoading] = useState(false)
  const [videoDragActive, setVideoDragActive] = useState(false)

  const videoInputRef = useRef(null)

  const [lectureForm, setLectureForm] = useState({
    title: "",
    description: "",
    videoFile: null,
    videoPreview: "",
    videoUrl: "",
  })

  /* ================= INIT (EDIT / VIEW) ================= */
  useEffect(() => {
    if (edit || view) {
      setLectureForm({
        title: modalData.title || "",
        description: modalData.description || "",
        videoFile: null,
        videoPreview: modalData.videoUrl || "",
        videoUrl: modalData.videoUrl || "",
      })
    }
  }, [edit, view, modalData])

  /* ================= VIDEO HANDLERS ================= */
  const handleVideoFile = (file) => {
    if (!file) return
    setLectureForm((prev) => ({
      ...prev,
      videoFile: file,
      videoPreview: URL.createObjectURL(file),
    }))
  }

  const handleVideoDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (e.type === "dragenter" || e.type === "dragover") {
      setVideoDragActive(true)
    } else if (e.type === "dragleave") {
      setVideoDragActive(false)
    }
  }

  const handleVideoDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setVideoDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleVideoFile(e.dataTransfer.files[0])
    }
  }

  /* ================= SAVE HANDLER ================= */
  const handleLectureSave = async () => {
    if (!lectureForm.title) {
      toast.error("Lecture title is required")
      return
    }

    const formData = new FormData()

    try {
      setLoading(true)

      /* ---------- ADD MODE ---------- */
      if (add) {
        formData.append("sectionId", modalData)
        formData.append("title", lectureForm.title)
        formData.append("description", lectureForm.description)

        if (lectureForm.videoFile) {
          formData.append("video", lectureForm.videoFile)
        }

        const result = await createSubSection(formData, token)

        if (result) {
          const updatedCourseContent = course.courseContent.map((section) =>
            section._id === modalData ? result : section
          )
          dispatch(
            setCourse({ ...course, courseContent: updatedCourseContent })
          )
        }
      }

      /* ---------- EDIT MODE ---------- */
      if (edit) {
        formData.append("sectionId", modalData.sectionId)
        formData.append("subSectionId", modalData._id)

        if (lectureForm.title !== modalData.title) {
          formData.append("title", lectureForm.title)
        }

        if (lectureForm.description !== modalData.description) {
          formData.append("description", lectureForm.description)
        }

        if (lectureForm.videoFile) {
          formData.append("video", lectureForm.videoFile)
        }

        const result = await updateSubSection(formData, token)

        if (result) {
          const updatedCourseContent = course.courseContent.map((section) =>
            section._id === modalData.sectionId ? result : section
          )
          dispatch(
            setCourse({ ...course, courseContent: updatedCourseContent })
          )
        }
      }

      toast.success("Lecture saved successfully")
      setModalData(null) 
    } catch (error) {
      toast.error("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  /* ================= UI ================= */
  return (
    <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/60">
<div className="w-full max-w-xl max-h-[90vh] rounded-xl bg-gray-900 border border-gray-800 flex flex-col">

        {/* HEADER */}
<div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 shrink-0">
          <h2 className="text-lg font-semibold text-white">
            {view ? "View Lecture" : edit ? "Edit Lecture" : "Add Lecture"}
          </h2>
          <button
            type="button"
            disabled={loading}
            onClick={() => setModalData(null)}
          >
            <RxCross2 className="text-xl text-gray-400 hover:text-white transition-colors" />
          </button>
        </div>

        {/* BODY */}
<div className="flex-1 overflow-y-auto px-6 py-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
          {/* TITLE */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Lecture Title
            </label>
            <input
              type="text"
              disabled={view}
              value={lectureForm.title}
              onChange={(e) =>
                setLectureForm({ ...lectureForm, title: e.target.value })
              }
              className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500"
              placeholder="e.g., Variables and Data Types"
            />
          </div>

          {/* DESCRIPTION */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Lecture Description
            </label>
            <textarea
              rows={3}
              disabled={view}
              value={lectureForm.description}
              onChange={(e) =>
                setLectureForm({
                  ...lectureForm,
                  description: e.target.value,
                })
              }
              className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 resize-none"
              placeholder="Describe what this lecture covers..."
            />
          </div>

          {/* VIDEO */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Lecture Video
            </label>

            <div
              onDragEnter={handleVideoDrag}
              onDragLeave={handleVideoDrag}
              onDragOver={handleVideoDrag}
              onDrop={handleVideoDrop}
              className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-all ${
                videoDragActive
                  ? "border-cyan-400 bg-cyan-500/10"
                  : lectureForm.videoPreview
                  ? "border-gray-700 bg-gray-950"
                  : "border-gray-700 bg-gray-950 hover:border-cyan-400/50 hover:bg-cyan-500/5"
              }`}
            >
              <input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                onChange={(e) =>
                  e.target.files && handleVideoFile(e.target.files[0])
                }
                className="hidden"
              />

              {lectureForm.videoPreview ? (
                <div className="space-y-4">
                  <video
                    src={lectureForm.videoPreview}
                    className="w-full h-32 rounded-lg bg-gray-800 object-cover"
                    controls
                  />
                  {!view && (
                    <div className="flex space-x-2 justify-center">
                      <button
                        type="button"
                        onClick={() => videoInputRef.current?.click()}
                        className="px-3 py-1 text-cyan-400 hover:text-cyan-300 transition-colors text-sm"
                      >
                        Replace Video
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setLectureForm({
                            ...lectureForm,
                            videoFile: null,
                            videoPreview: "",
                            videoUrl: "",
                          })
                        }
                        className="px-3 py-1 text-red-400 hover:text-red-300 transition-colors text-sm"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-center">
                    <div className="p-3 bg-cyan-500/10 rounded-lg">
                      <Video className="w-8 h-8 text-cyan-400" />
                    </div>
                  </div>
                  <div>
                    <p className="text-white font-medium mb-1">
                      Upload Lecture Video
                    </p>
                    <p className="text-gray-400 text-sm mb-3">
                      Drag and drop your video here, or click to select
                    </p>
                  </div>
                  {!view && (
                    <button
                      type="button"
                      onClick={() => videoInputRef.current?.click()}
                      className="px-6 py-2 bg-cyan-500/20 border border-cyan-500/50 text-cyan-400 rounded-lg hover:bg-cyan-500/30 transition-all text-sm font-medium"
                    >
                      Choose Video
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        {!view && (
<div className="flex space-x-3 px-6 py-4 border-t border-gray-800 shrink-0">
            <button
              type="button"
              onClick={() => setModalData(null)}
              className="flex-1 px-4 py-2 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!lectureForm.title || loading}
              onClick={handleLectureSave}
              className="flex-1 px-4 py-2 bg-cyan-500 text-white rounded-lg hover:bg-cyan-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Save Lecture"}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
