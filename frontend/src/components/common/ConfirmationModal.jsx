import React from "react"
import IconBtn from "./IconBtn"

const ConfirmationModel = ({ modalData }) => {
  return (
    <div className="fixed inset-0 z-[1000] grid place-items-center bg-[#020617]/80 backdrop-blur-sm">
      <div
        className="
          w-11/12 max-w-[360px]
          rounded-2xl
          border border-[rgba(34,211,238,0.15)]
          bg-[#020617]
          p-6
          shadow-[0_0_25px_rgba(34,211,238,0.12)]
        "
      >
        {/* Heading */}
        <p className="text-xl font-semibold text-[#E5E7EB]">
          {modalData?.text1}
        </p>

        {/* Sub text */}
        <p className="mt-3 text-sm leading-6 text-[#94A3B8]">
          {modalData?.text2}
        </p>

        {/* Actions */}
        <div className="mt-6 flex justify-end gap-3">
          {/* Secondary button */}
          <button
            onClick={modalData?.btn2Handler}
            className="
              rounded-md
              border border-[#3B82F6]
              px-4 py-2
              text-sm font-medium
              text-[#3B82F6]
              transition-all
              hover:bg-[rgba(59,130,246,0.1)]
            "
          >
            {modalData?.btn2Text}
          </button>

          {/* Primary button */}
          <button
            onClick={modalData?.btn1Handler}
            className="
              rounded-md
              bg-[#22D3EE]
              px-4 py-2
              text-sm font-semibold
              text-[#020617]
              transition-all
              hover:bg-[#67E8F9]
              hover:shadow-[0_0_12px_rgba(103,232,249,0.6)]
            "
          >
            {modalData?.btn1Text}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationModel
