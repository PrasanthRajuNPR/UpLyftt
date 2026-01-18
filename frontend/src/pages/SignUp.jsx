import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import {
  BookOpen,
  Mail,
  Lock,
  User,
  Users,
  GraduationCap,
  AlertCircle,
} from "lucide-react"

import { sendOtp } from "../services/operations/authAPI"
import { setSignupData } from "../redox/slices/authSlice"
import { ACCOUNT_TYPE } from "../utils/constants"

import signupImg from "../assets/Images/signuppageimage.png"
export default function SignUp() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: ACCOUNT_TYPE.STUDENT,
  })

  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setError("")

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setLoading(true)

    const signupPayload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      password: formData.password,
      confirmPassword: formData.confirmPassword,
      accountType: formData.role,
    }

    dispatch(setSignupData(signupPayload))
    dispatch(sendOtp(formData.email, navigate))

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex">

      {/* LEFT – FORM */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">

          {/* HEADER */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 mb-4">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Create Account
            </h1>
            <p className="text-gray-400">
              Join our learning community today
            </p>
          </div>

          {/* FORM */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 flex items-start space-x-3">
                <AlertCircle className="w-5 h-5 text-red-500 mt-0.5" />
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}

            {/* NAME */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  First Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) =>
                      setFormData({ ...formData, firstName: e.target.value })
                    }
                    required
                    placeholder="John"
                    className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Last Name
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) =>
                    setFormData({ ...formData, lastName: e.target.value })
                  }
                  required
                  placeholder="Doe"
                  className="w-full bg-gray-900 border border-gray-800 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>

            {/* EMAIL */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  required
                  placeholder="you@example.com"
                  className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Create Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  required
                  placeholder="Min. 6 characters"
                  className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>

            {/* CONFIRM PASSWORD */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      confirmPassword: e.target.value,
                    })
                  }
                  required
                  placeholder="Re-enter password"
                  className="w-full bg-gray-900 border border-gray-800 rounded-lg pl-10 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500"
                />
              </div>
            </div>

            {/* ROLE SELECTION */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-3">
                I am a
              </label>

              <div className="grid grid-cols-2 gap-4">
                {/* STUDENT */}
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, role: ACCOUNT_TYPE.STUDENT })
                  }
                  className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${
                    formData.role === ACCOUNT_TYPE.STUDENT
                      ? "border-cyan-500 bg-cyan-500/10"
                      : "border-gray-800 bg-gray-900 hover:border-gray-700"
                  }`}
                >
                  <Users
                    className={`w-8 h-8 mb-2 transition-colors ${
                      formData.role === ACCOUNT_TYPE.STUDENT
                        ? "text-cyan-400"
                        : "text-gray-500"
                    }`}
                  />
                  <span
                    className={`font-semibold transition-colors ${
                      formData.role === ACCOUNT_TYPE.STUDENT
                        ? "text-cyan-400"
                        : "text-gray-400"
                    }`}
                  >
                    Student
                  </span>
                </button>

                {/* INSTRUCTOR */}
                <button
                  type="button"
                  onClick={() =>
                    setFormData({ ...formData, role: ACCOUNT_TYPE.INSTRUCTOR })
                  }
                  className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all ${
                    formData.role === ACCOUNT_TYPE.INSTRUCTOR
                      ? "border-cyan-500 bg-cyan-500/10"
                      : "border-gray-800 bg-gray-900 hover:border-gray-700"
                  }`}
                >
                  <GraduationCap
                    className={`w-8 h-8 mb-2 transition-colors ${
                      formData.role === ACCOUNT_TYPE.INSTRUCTOR
                        ? "text-cyan-400"
                        : "text-gray-500"
                    }`}
                  />
                  <span
                    className={`font-semibold transition-colors ${
                      formData.role === ACCOUNT_TYPE.INSTRUCTOR
                        ? "text-cyan-400"
                        : "text-gray-400"
                    }`}
                  >
                    Instructor
                  </span>
                </button>
              </div>
            </div>

            {/* SUBMIT */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-3 rounded-lg font-semibold hover:from-cyan-600 hover:to-blue-600 transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* FOOTER */}
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT – IMAGE */}
      <div className="hidden lg:flex flex-1 items-center justify-center p-8 bg-gradient-to-br from-cyan-900/20 to-blue-900/20">
        <div className="max-w-md text-center">
          <img
            src={signupImg}
            alt="Learning"
            className="rounded-2xl shadow-2xl mb-8 border border-gray-800"
          />
          <h2 className="text-3xl font-bold text-white mb-4">
            Start Your Journey
          </h2>
          <p className="text-gray-400 text-lg">
            Learn from experts or share your knowledge with the world
          </p>
        </div>
      </div>
    </div>
  )
}
