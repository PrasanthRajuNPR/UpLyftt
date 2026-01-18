import { useState } from "react"
import { ChevronDown, ChevronUp, Edit, Trash2, Plus } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"

import {
  deleteSection,
  deleteSubSection,
} from "../../../../../services/operations/courseDetailsAPI"
import { setCourse } from "../../../../../redox/slices/courseSlice"
import ConfirmationModal from "../../../../common/ConfirmationModal"
import SubSectionModal from "./SubSectionModal"

export default function NestedView({ handleChangeEditSectionName }) {
  const { course } = useSelector((state) => state.course)
  const { token } = useSelector((state) => state.auth)
  const dispatch = useDispatch()

  const [expandedSection, setExpandedSection] = useState(null)
  const [addSubSection, setAddSubsection] = useState(null)
  const [viewSubSection, setViewSubSection] = useState(null)
  const [editSubSection, setEditSubSection] = useState(null)
  const [confirmationModal, setConfirmationModal] = useState(null)

  const handleDeleteSection = async (sectionId) => {
    const result = await deleteSection({
      sectionId,
      courseId: course._id,
      
    },token)

    if (result) {
      dispatch(setCourse(result))
    }

    setConfirmationModal(null)
  }

  const handleDeleteSubSection = async (subSectionId, sectionId) => {
    const result = await deleteSubSection({ subSectionId, sectionId },token)

    if (result) {
      const updatedCourseContent = course.courseContent.map((section) =>
        section._id === sectionId ? result : section
      )

      dispatch(
        setCourse({ ...course, courseContent: updatedCourseContent })
      )
    }

    setConfirmationModal(null)
  }

  return (
    <>
      <div className="space-y-4">
        {course?.courseContent?.map((section) => (
          <div
            key={section._id}
            className="bg-gray-950 border border-gray-800 rounded-lg overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 bg-gray-900">
              <div className="flex items-center space-x-3">
                <button
                  onClick={() =>
                    setExpandedSection(
                      expandedSection === section._id ? null : section._id
                    )
                  }
                  className="text-gray-400 hover:text-white"
                >
                  {expandedSection === section._id ? (
                    <ChevronUp />
                  ) : (
                    <ChevronDown />
                  )}
                </button>

                <h3 className="font-semibold text-white">
                  {section.sectionName}
                </h3>

                <span className="text-sm text-gray-500">
                  ({section.subSection.length} lectures)
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    handleChangeEditSectionName(
                      section._id,
                      section.sectionName
                    )
                  }
                  className="text-cyan-400 hover:text-cyan-300"
                >
                  <Edit size={18} />
                </button>

                <button
                  onClick={() =>
                    setConfirmationModal({
                      text1: "Delete this Section?",
                      text2:
                        "All the lectures in this section will be deleted",
                      btn1Text: "Delete",
                      btn2Text: "Cancel",
                      btn1Handler: () =>
                        handleDeleteSection(section._id),
                      btn2Handler: () =>
                        setConfirmationModal(null),
                    })
                  }
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>

            {expandedSection === section._id && (
              <div className="p-4 space-y-3">
                <button
                  onClick={() => setAddSubsection(section._id)}
                  className="w-full px-4 py-2 border border-dashed border-gray-700 text-cyan-400 rounded-lg hover:bg-cyan-500/10 transition-colors flex items-center justify-center gap-2"
                >
                  <Plus size={16} />
                  Add Lecture
                </button>

                {section.subSection.map((lecture) => (
                  <div
                    key={lecture._id}
                    onClick={() => setViewSubSection(lecture)}
                    className="flex items-center justify-between px-4 py-3 bg-gray-900 border border-gray-800 rounded-lg cursor-pointer"
                  >
                    <div>
                      <h4 className="font-medium text-white">
                        {lecture.title}
                      </h4>
                      <p className="text-sm text-gray-400 line-clamp-1">
                        {lecture.description}
                      </p>
                    </div>

                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="flex gap-2"
                    >
                      <button
                        onClick={() =>
                          setEditSubSection({
                            ...lecture,
                            sectionId: section._id,
                          })
                        }
                        className="text-cyan-400 hover:bg-cyan-500/10 p-2 rounded-lg"
                      >
                        <Edit size={16} />
                      </button>

                      <button
                        onClick={() =>
                          setConfirmationModal({
                            text1:
                              "Delete this Sub-Section?",
                            text2:
                              "This lecture will be deleted",
                            btn1Text: "Delete",
                            btn2Text: "Cancel",
                            btn1Handler: () =>
                              handleDeleteSubSection(
                                lecture._id,
                                section._id
                              ),
                            btn2Handler: () =>
                              setConfirmationModal(null),
                          })
                        }
                        className="text-red-400 hover:bg-red-500/10 p-2 rounded-lg"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {addSubSection && (
        <SubSectionModal
          modalData={addSubSection}
          setModalData={setAddSubsection}
          add
        />
      )}

      {viewSubSection && (
        <SubSectionModal
          modalData={viewSubSection}
          setModalData={setViewSubSection}
          view
        />
      )}

      {editSubSection && (
        <SubSectionModal
          modalData={editSubSection}
          setModalData={setEditSubSection}
          edit
        />
      )}

      {confirmationModal && (
        <ConfirmationModal modalData={confirmationModal} />
      )}
    </>
  )
}
