import { IoIosArrowBack } from "react-icons/io";
import IconBtn from "../../common/IconBtn";
import { useEffect, useState } from "react"
import {
  ChevronDown,
  ChevronRight,
  CheckCircle2,
  Circle,
  MoreHorizontal,
  X,
} from "lucide-react"
import { useSelector } from "react-redux"
import { useNavigate, useParams } from "react-router-dom"

export default function VideoDetailsSidebar({setReviewModal}) {
  const navigate = useNavigate()
  const { sectionId, subSectionId } = useParams()

  const { courseSectionData, courseEntireData, completedLectures } =
    useSelector((state) => state.viewCourse)

  const [expandedSections, setExpandedSections] = useState(new Set())
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  

  useEffect(() => {
    const index = courseSectionData.findIndex((s) => s._id === sectionId)
    if (index !== -1) {
      setExpandedSections(new Set([index]))
    }
  }, [sectionId, courseSectionData])

  const toggleSection = (index) => {
    setExpandedSections((prev) => {
      const set = new Set(prev)
      set.has(index) ? set.delete(index) : set.add(index)
      return set
    })
  }

  return (
    <>
    
      {/* MOBILE TOGGLE BUTTON */}
      {!isMobileSidebarOpen && (
        <div className="lg:hidden fixed top-4 left-4 z-50 mt-14">
          <button
            onClick={() => setIsMobileSidebarOpen(true)}
            className="p-2 bg-[#1E293B]/70 rounded-full"
          >
            <MoreHorizontal className="w-6 h-6 text-[#E5E7EB]" />
          </button>
        </div>
      )}

      {/* SIDEBAR */}
      <div
        className={` mt-14 lg:mt-0 
          fixed top-0 left-0 h-screen w-full sm:w-80 lg:w-96 bg-[#020617] border-r border-[#1E293B] overflow-y-auto transform transition-transform duration-300 z-40
          ${isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0 lg:static lg:block
        `}
      >
        <div className="p-6 relative">
          {/* NEW SECTION - Back Button and Add Review Button */}
          <div className="flex w-full items-center justify-between mb-6">
            <div
              onClick={() => {
                navigate(`/dashboard/enrolled-courses`)
              }}
              className="flex h-[35px] w-[35px] items-center justify-center rounded-full bg-richblack-100 p-1 text-richblack-700 hover:scale-90"
              title="back"
            >
              <IoIosArrowBack size={30} />
            </div>
            <IconBtn
              text="Add Review"
              customClasses="ml-auto"
              onclick={() => setReviewModal(true)}
            />
            <div className="lg:hidden flex justify-end ml-2  right-6 top-6 z-50 "> <button onClick={() => setIsMobileSidebarOpen(false)} className="p-2 bg-[#1E293B]/70 rounded-full" > <X className="w-6 h-6 text-[#E5E7EB]" /> </button> </div>
          </div>

          <h1 className="text-2xl font-bold text-[#E5E7EB] mb-8 mx-4">
            {courseEntireData?.courseName}
          </h1>

          <div className="space-y-4">
            {courseSectionData.map((section, sectionIndex) => {
              const isExpanded = expandedSections.has(sectionIndex)
              const completedCount = section.subSection.filter((sub) =>
                completedLectures.includes(sub._id)
              ).length

              return (
                <div key={section._id} className="space-y-2">
                  {/* SECTION HEADER */}
                  <button
                    onClick={() => toggleSection(sectionIndex)}
                    className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-[#1E293B]/50 transition-colors group"
                  >
                    <div className="flex items-center gap-3">
                      {isExpanded ? (
                        <ChevronDown className="w-5 h-5 text-[#22D3EE]" />
                      ) : (
                        <ChevronRight className="w-5 h-5 text-[#94A3B8]" />
                      )}
                      <span className="text-[#CBD5E1] font-medium text-left">
                        {section.sectionName}
                      </span>
                    </div>
                    <span className="text-sm text-[#94A3B8]">
                      {completedCount}/{section.subSection.length}
                    </span>
                  </button>

                  {/* SUBSECTIONS */}
                  {isExpanded && (
                    <div className="ml-4 space-y-1 animate-fade-in">
                      {section.subSection.map((subsection, subIndex) => {
                        const isActive = subsection._id === subSectionId
                        const isCompleted = completedLectures.includes(
                          subsection._id
                        )
                        const isLast =
                          subIndex === section.subSection.length - 1

                        return (
                          <div key={subsection._id} className="relative ">
                            <div className="flex items-start gap-3">
                              {/* TIMELINE */}
                              <div className="relative flex flex-col items-center pt-3">
                                <div 
                                  className={`mb-4 w-6 h-6 rounded-full flex items-center justify-center z-10 transition-all duration-300 ${
                                    isActive
                                      ? "bg-[#22D3EE] shadow-[0_0_20px_rgba(34,211,238,0.6)] scale-110"
                                      : isCompleted
                                      ? "bg-[#22D3EE]/20 border-2 border-[#22D3EE]"
                                      : "bg-[#1E293B] border-2 border-[#94A3B8]/30"
                                  }`}
                                >
                                  {isCompleted ? (
                                    <CheckCircle2 className="w-4 h-4 text-[#22D3EE] " />
                                  ) : isActive ? (
                                    <Circle className="w-3 h-3 text-[#020617] fill-[#020617]" />
                                  ) : (
                                    <Circle className="w-3 h-3 text-[#94A3B8]/50" />
                                  )}
                                </div>

                                {!isLast && (
                                  <div
                                    className={`absolute top-8 w-0.5 h-10 transition-all duration-500 ${
                                      isCompleted
                                        ? "bg-gradient-to-b from-[#22D3EE] to-[#22D3EE]/30 shadow-[0_0_10px_rgba(34,211,238,0.4)]"
                                        : "bg-[#1E293B]"
                                    }`}
                                  />
                                )}
                              </div>

                              {/* TITLE */}
                              <button
                                onClick={() => {
                                  navigate(`/view-course/${courseEntireData._id}/section/${section._id}/sub-section/${subsection._id}`);
                                  setIsMobileSidebarOpen(false);
                                }}
                                className={`flex-1 text-left p-3 rounded-lg transition-all duration-300 group ${
                                  isActive
                                    ? "bg-[#22D3EE]/10 border border-[#22D3EE]/30"
                                    : "hover:bg-[#1E293B]/50"
                                }`}
                              >
                                <span
                                  className={`text-sm font-medium leading-relaxed transition-colors ${
                                    isActive
                                      ? "text-[#22D3EE]"
                                      : isCompleted
                                      ? "text-[#CBD5E1]"
                                      : "text-[#94A3B8]"
                                  }`}
                                >
                                  {subsection.title}
                                </span>
                              </button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* EXACT animation from design */}
        <style>{`
          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translateY(-8px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fade-in {
            animation: fade-in 0.3s ease-out;
          }
        `}</style>
      </div>

      {/* MOBILE BACKDROP */}
      {isMobileSidebarOpen && (
        <div
          onClick={() => setIsMobileSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
        />
      )}
    </>
  )
}
