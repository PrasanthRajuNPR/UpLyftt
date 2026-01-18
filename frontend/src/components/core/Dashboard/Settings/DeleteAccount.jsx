import { useState } from "react"
import { FiTrash2 } from "react-icons/fi"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { deleteProfile } from "../../../../services/operations/settingsApi"

export default function DeleteAccount() {
  const { token } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [showModal, setShowModal] = useState(false)

  async function handleDeleteAccount() {
    try {
      dispatch(deleteProfile(token, navigate))
      setShowModal(false)
    } catch (error) {
      console.log("ERROR MESSAGE - ", error.message)
    }
  }

  return (
    <>
      {/* Delete Account Card */}
      <div
        className="
          my-10 flex gap-5 rounded-2xl
          border border-[rgba(34,211,238,0.15)]
          bg-[#020617]
          p-8
          shadow-[0_0_20px_rgba(34,211,238,0.08)]
        "
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[rgba(239,68,68,0.15)]">
          <FiTrash2 className="text-2xl text-[#EF4444]" />
        </div>

        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold text-[#E5E7EB]">
            Delete Account
          </h2>

          <p className="max-w-xl text-sm leading-6 text-[#94A3B8]">
            This account may contain paid courses. Deleting your account is
            permanent and will remove all associated content and data.
          </p>

          {/* ORIGINAL BUTTON — unchanged */}
          <button
            type="button"
            className="w-fit cursor-pointer italic text-pink-300 hover:text-pink-100"
            onClick={() => setShowModal(true)}
          >
            I want to delete my account.
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[1000] grid place-items-center bg-[#020617]/80 backdrop-blur-sm">
          <div
            className="
              w-11/12 max-w-[380px]
              rounded-2xl
              border border-[rgba(34,211,238,0.15)]
              bg-[#020617]
              p-6
              shadow-[0_0_25px_rgba(34,211,238,0.12)]
            "
          >
            <h3 className="text-2xl font-bold text-[#E5E7EB] text-center">
              Are you sure you want to delete your account?
            </h3>

            <p className="mt-4 text-center text-sm text-[#94A3B8]">
              This action is permanent and cannot be undone. All your data,
              courses, and content will be lost forever.
            </p>

            <div className="mt-6 flex justify-evenly space-x-4">
              {/* Cancel — SAME button, only glow */}
              <button
                className="
                  px-6 py-2 text-softwhite bg-gray-600 rounded-md
                  hover:bg-gray-700
                  focus:ring-2 focus:ring-cyan-400
                  hover:shadow-[0_0_10px_rgba(103,232,249,0.4)]
                  transition-all duration-200
                "
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>

              {/* Delete — SAME button, only glow */}
              <button
                className="
                  px-6 py-2 text-white bg-red-600 rounded-md
                  hover:bg-red-700
                  focus:ring-2 focus:ring-red-500
                  hover:shadow-[0_0_12px_rgba(239,68,68,0.6)]
                  active:scale-95
                  transition-all duration-200
                "
                onClick={handleDeleteAccount}
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
