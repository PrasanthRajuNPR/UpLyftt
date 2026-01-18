import React, { useState } from "react"
import copy from "copy-to-clipboard"
import { toast } from "react-hot-toast"
import { ShoppingCart, Share2 } from "lucide-react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { addToCart } from "../../../redox/slices/cartSlice"
import { ACCOUNT_TYPE } from "../../../utils/constants"

function CourseDetailsCard({ course, setConfirmationModal, handleBuyCourse ,mobile}) {
  const { user } = useSelector((state) => state.profile)
  const { token } = useSelector((state) => state.auth)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [copied, setCopied] = useState(false)

  const {
    thumbnail,
    price,
    courseName,
    studentsEnrolled = [],
  } = course

  const isEnrolled = user?._id && studentsEnrolled.includes(user?._id);

  const handleShare = () => {
    copy(window.location.href)
    setCopied(true)
    toast.success("Link copied to clipboard")
    setTimeout(() => setCopied(false), 2000)
  }

  const handleAddToCart = () => {
    if (user && user?.accountType === ACCOUNT_TYPE.INSTRUCTOR) {
      toast.error("You are an Instructor. You can't buy a course.")
      return
    }

    if (token) {
      dispatch(addToCart(course))
      return
    }

    setConfirmationModal({
      text1: "You are not logged in!",
      text2: "Please login to add To Cart",
      btn1Text: "Login",
      btn2Text: "Cancel",
      btn1Handler: () => navigate("/login"),
      btn2Handler: () => setConfirmationModal(null),
    })
  }

  return (
    <div className="sticky top-6 my-6 lg:mx-2">
      <div className="bg-[#020617] border border-[#1E293B] rounded-2xl overflow-hidden transition-all duration-300 hover:border-[#22D3EE]/30 hover:shadow-[0_0_30px_rgba(34,211,238,0.15)]">
        {console.log("courseuuuu ",course)}
        {/* Thumbnail */}
        {(mobile===false)?(<div className="relative aspect-video overflow-hidden">
          <img
            src={thumbnail}
            alt={courseName}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#020617] to-transparent opacity-60" />
        </div>):(<></>)}

        <div className="p-6 space-y-6">

          {/* Price */}
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold text-[#22D3EE]">
              ₹{price}
            </span>
            <span className="text-[#94A3B8] line-through text-lg">
              ₹{(price * 1.8).toFixed(0)}
            </span>
          </div>

          {/* Buy / Go to Course */}
          <button
            onClick={
              isEnrolled
                ? () => navigate("/dashboard/enrolled-courses")
                : handleBuyCourse
            }
            className="w-full py-4 bg-[#22D3EE] text-[#020617] font-semibold rounded-xl transition-all duration-300 hover:bg-[#67E8F9] hover:shadow-[0_0_25px_rgba(34,211,238,0.5)] transform hover:scale-[1.02]"
          >
            {isEnrolled ? "Go To Course" : "Buy Now"}
          </button>

          {/* Add to Cart */}
          {!isEnrolled && (
            <button
              onClick={handleAddToCart}
              className="w-full py-4 border-2 border-[#3B82F6] text-[#3B82F6] font-semibold rounded-xl transition-all duration-300 hover:bg-[#3B82F6]/10 hover:border-[#3B82F6]/80 flex items-center justify-center gap-2"
            >
              <ShoppingCart className="w-5 h-5" />
              Add to Cart
            </button>
          )}

          {/* Share */}
          <button
            onClick={handleShare}
            className="w-full py-3 border border-[#1E293B] text-[#CBD5E1] rounded-xl transition-all duration-300 hover:border-[#22D3EE]/50 hover:bg-[#22D3EE]/5 flex items-center justify-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            {copied ? "Link Copied!" : "Share Course"}
          </button>

          {/* Info */}
          <div className="pt-4 border-t border-[#1E293B] space-y-3">
            <p className="text-[#94A3B8] text-sm text-center">
              30-Day Money-Back Guarantee
            </p>
            <p className="text-[#94A3B8] text-sm text-center">
              Full Lifetime Access
            </p>
          </div>

        </div>
      </div>
    </div>
  )
}

export default CourseDetailsCard
