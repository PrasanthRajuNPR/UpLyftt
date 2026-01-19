import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import { Mail } from "lucide-react";
import { getResetPasswordToken } from "../services/operations/authAPI";
import { motion } from 'framer-motion';
const ForgotPassWord = () => {
  const { loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState("");

  const handleOnSubmit = (e) => {
    e.preventDefault();
    dispatch(getResetPasswordToken(email, setEmailSent));
  };

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center px-4 sm:px-6">
      <div className="w-full max-w-sm sm:max-w-md">

        {/* Back to login */}
        <Link
          to="/login"
          className="mb-4 sm:mb-6 flex items-center gap-2 text-[#94A3B8] hover:text-[#22D3EE] transition-colors duration-300"
        >
          <BiArrowBack className="text-base sm:text-lg" />
          <span className="text-sm">Back to Login</span>
        </Link>

        {/* Card */}
        <div className="bg-[#020617] border border-[#1E293B] rounded-2xl p-5 sm:p-8 transition-all duration-300 hover:border-[#22D3EE]/30 hover:shadow-[0_0_30px_rgba(34,211,238,0.08)]">
          {loading ? (
            <div className="flex items-center justify-center min-h-screen bg-[#020617]">
      {/* Card Container */}
      <div className="relative p-12 bg-[#020617]  rounded-2xl shadow-2xl overflow-hidden group">
        
        {/* Subtle Ambient Glow */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#3B82F6]/5 to-[#22D3EE]/5 opacity-0  transition-opacity duration-500" />

        <div className="relative flex flex-col items-center gap-6">
          <div className="relative w-20 h-20">
            {/* Outer Ring (Primary Accent) */}
            <motion.div
              className="absolute inset-0 rounded-full border-4 border-transparent border-t-[#22D3EE] border-l-[#22D3EE]/30"
              animate={{ rotate: 360 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: "linear"
              }}
              style={{
                filter: "drop-shadow(0 0 8px #67E8F9)"
              }}
            />

            {/* Inner Ring (Secondary Accent) */}
            <motion.div
              className="absolute inset-2 rounded-full border-4 border-transparent border-b-[#3B82F6] border-r-[#3B82F6]/20"
              animate={{ rotate: -360 }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "linear"
              }}
            />

            {/* Center Core Dot */}
            <div className="absolute inset-0 m-auto w-2 h-2 bg-[#67E8F9] rounded-full shadow-[0_0_15px_#67E8F9]" />
          </div>

          {/* Loading Text */}
          <span className="text-sm font-medium tracking-widest text-[#22D3EE] uppercase animate-pulse">
            Loading {<div className="mt-8 flex gap-2 justify-center">
          <div
            className="w-2 h-2 bg-[#22D3EE] rounded-full animate-bounce-dot"
            style={{ animationDelay: "0s" }}
          ></div>
          <div
            className="w-2 h-2 bg-[#3B82F6] rounded-full animate-bounce-dot"
            style={{ animationDelay: "0.2s" }}
          ></div>
          <div
            className="w-2 h-2 bg-[#67E8F9] rounded-full animate-bounce-dot"
            style={{ animationDelay: "0.4s" }}
          ></div>
        </div>}
            
          </span>
        </div>
      </div>
    </div>
          ) : (
            <>
              {!emailSent ? (
                <>
                  {/* Header */}
                  <div className="mb-6 sm:mb-8 text-center">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#22D3EE]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                      <Mail className="w-7 h-7 sm:w-8 sm:h-8 text-[#22D3EE]" />
                    </div>

                    <h1 className="text-2xl sm:text-3xl font-bold text-[#E5E7EB] mb-2 sm:mb-3">
                      Reset Password
                    </h1>

                    <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed">
                      Don't worry. We'll send you a secure password reset link to your email.
                    </p>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleOnSubmit} className="space-y-5 sm:space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-[#CBD5E1] mb-2">
                        Email Address
                      </label>
                      <input
                        required
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full px-4 py-3 bg-[#020617] border border-[#1E293B] rounded-xl text-sm sm:text-base text-[#E5E7EB] placeholder-[#64748B] focus:outline-none focus:border-[#22D3EE] focus:shadow-[0_0_20px_rgba(34,211,238,0.15)] transition-all duration-300"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-[#22D3EE] text-[#020617] font-semibold py-3 px-6 rounded-xl text-sm sm:text-base hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] transition-all duration-300 transform hover:scale-[1.02]"
                    >
                      Send Reset Link
                    </button>
                  </form>
                </>
              ) : (
                /* Email Sent State */
                <div className="text-center">
                  <div className="w-14 h-14 sm:w-16 sm:h-16 bg-[#22D3EE]/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Mail className="w-7 h-7 sm:w-8 sm:h-8 text-[#22D3EE]" />
                  </div>

                  <h2 className="text-xl sm:text-2xl font-bold text-[#E5E7EB] mb-2 sm:mb-3">
                    Check Your Email
                  </h2>

                  <p className="text-sm sm:text-base text-[#94A3B8] leading-relaxed mb-5 sm:mb-6">
                    We've sent a reset link to{" "}<br></br>
                    <span className="text-[#CBD5E1] font-medium break-all">
                      {email}
                    </span>
                  </p>

                  <button
                    onClick={() => dispatch(getResetPasswordToken(email, setEmailSent))}
                    className="text-sm font-medium text-[#22D3EE] hover:text-[#67E8F9] transition-colors duration-300"
                  >
                    Resend Email
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassWord;
