import { useState } from "react";
import { ChevronDown, FileText } from "lucide-react";

export default function CourseAccordionBar({ courseContent }) {
  const [expandedSections, setExpandedSections] = useState(new Set([0]));

  const toggleSection = (index) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedSections(newExpanded);
  };

  const totalLectures = courseContent.reduce(
    (acc, section) => acc + (section.subSection?.length || 0),
    0
  );

  return (
    <div className="bg-[#020617] border border-[#1E293B] rounded-2xl p-8 transition-all duration-300 hover:border-[#22D3EE]/30 hover:shadow-[0_0_20px_rgba(34,211,238,0.1)]">

      {/* Header */}
      <div className="mb-6">
        <h2 className="text-[28px] font-semibold text-[#E5E7EB] mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Course Content
        </h2>
        <p className="text-[#94A3B8] text-[14px]">
          {courseContent.length} sections • {totalLectures} lectures
        </p>
      </div>

      {/* Sections */}
      <div className="space-y-3">
        {courseContent.map((section, index) => {
          const isExpanded = expandedSections.has(index);

          return (
            <div
              key={section._id || index}
              className="border border-[#1E293B] rounded-xl overflow-hidden transition-all duration-300 hover:border-[#3B82F6]/50"
            >
              {/* Section Header */}
              <button
                onClick={() => toggleSection(index)}
                className="w-full px-6 py-4 flex items-center justify-between bg-[#020617] hover:bg-[#1E293B]/30 transition-colors duration-200"
              >
                <div className="flex items-center gap-3">
                  <ChevronDown
                    className={`w-5 h-5 text-[#22D3EE] transition-transform duration-300 ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  />
                  <span className="text-[#CBD5E1] font-medium text-[16px]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    {section.sectionName}
                  </span>
                </div>
                <span className="text-[#94A3B8] text-[14px]">
                  {section.subSection?.length || 0} lectures
                </span>
              </button>

              {/* Section Content */}
              <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                  isExpanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="px-6 py-3 space-y-2 bg-[#020617]/50">
                  {section.subSection?.map((subSec, subIndex) => (
                    <div
                      key={subIndex}
                      className="flex items-center gap-3 py-2 px-3 rounded-lg hover:bg-[#1E293B]/30 transition-colors duration-200"
                    >
                      <FileText className="w-4 h-4 text-[#3B82F6] flex-shrink-0" />
                      <span className="text-[#94A3B8] text-[14px]" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        {subSec.title || subSec.subSectionName || subSec}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
