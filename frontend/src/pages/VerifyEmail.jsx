import { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import { HiShieldCheck } from "react-icons/hi";
import { signUp, sendOtp } from "../services/operations/authAPI";
import { setSignupData } from "../redox/slices/authSlice";
import { motion } from 'framer-motion';
const VerifyEmail = () => {
  const { loading, signUpData } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (!signUpData) navigate("/signup");
    if (inputRefs.current[0]) inputRefs.current[0].focus();
  }, [signUpData, navigate]);

  const handleChange = (index, value) => {
    if (value.length > 1) value = value.slice(0, 1);
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split("").forEach((char, i) => {
      if (i < 6) newOtp[i] = char;
    });
    setOtp(newOtp);

    const nextEmpty = newOtp.findIndex((d) => !d);
    const focusIndex = nextEmpty === -1 ? 5 : nextEmpty;
    inputRefs.current[focusIndex]?.focus();
  };

  const handleVerify = (e) => {
    e.preventDefault();
    const otpString = otp.join("");
    if (otpString.length !== 6) return;

    const {
      accountType,
      firstName,
      lastName,
      email,
      password,
      confirmPassword,
    } = signUpData;

    dispatch(
      signUp(
        accountType,
        firstName,
        lastName,
        email,
        password,
        confirmPassword,
        otpString,
        navigate
      )
    );
  };

  const handleResend = () => {
    if (signUpData?.email) {
      dispatch(sendOtp(signUpData.email,navigate));
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    }
  };

  if (loading) {
    return (
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
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] flex items-center justify-center p-4 sm:p-6">
  <div className="w-full max-w-md sm:max-w-lg">
    <button
      onClick={() => navigate("/signup")}
      className="mb-6 flex items-center gap-2 text-[#94A3B8] hover:text-[#22D3EE] transition-colors duration-300"
    >
      <BiArrowBack className="w-4 h-4 sm:w-5 sm:h-5" />
      <span className="text-sm sm:text-base">Back to Signup</span>
    </button>

    <div className="bg-[#020617] border border-[#1E293B] rounded-2xl p-6 sm:p-8 transition-all duration-300 hover:border-[#22D3EE]/30 hover:shadow-[0_0_30px_rgba(34,211,238,0.08)]">
      <div className="mb-6 sm:mb-8 text-center">
        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-[#22D3EE]/10 rounded-xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
          <HiShieldCheck className="w-6 h-6 sm:w-8 sm:h-8 text-[#22D3EE]" />
        </div>
        <h2 className="text-2xl sm:text-3xl font-bold text-[#E5E7EB] mb-2 sm:mb-3">
          Verify Email
        </h2>
        <p className="text-xs sm:text-sm text-[#94A3B8] leading-relaxed">
          We've sent a 6-digit verification code to your email. Please enter it below to verify your account.
        </p>
      </div>

      <form onSubmit={handleVerify}>
        <div
  className="flex gap-2 justify-center mb-6 sm:mb-8"
  onPaste={handlePaste}
>
  {otp.map((digit, index) => (
    <input
      key={index}
      ref={(el) => (inputRefs.current[index] = el)}
      type="text"
      inputMode="numeric"
      maxLength={1}
      value={digit}
      onChange={(e) => handleChange(index, e.target.value)}
      onKeyDown={(e) => handleKeyDown(index, e)}
      className="flex-1 min-w-[2rem] max-w-[3rem] h-12 sm:h-14 text-center text-lg sm:text-2xl font-semibold bg-[#020617] border border-[#1E293B] rounded-xl text-[#E5E7EB] focus:outline-none focus:border-[#22D3EE] focus:shadow-[0_0_20px_rgba(34,211,238,0.25)] transition-all duration-300"
    />
  ))}
</div>

        <button
          type="submit"
          disabled={otp.join("").length !== 6}
          className="w-full bg-[#22D3EE] text-[#020617] font-semibold py-2.5 sm:py-3 px-5 sm:px-6 rounded-xl hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none mb-4 sm:mb-6"
        >
          Verify Email
        </button>
      </form>

      <div className="flex flex-col sm:flex-row items-center justify-between text-sm gap-2 sm:gap-0">
        <button
          onClick={() => navigate("/signup")}
          className="text-[#94A3B8] hover:text-[#22D3EE] transition-colors duration-300"
        >
          Back to Signup
        </button>
        <button
          onClick={handleResend}
          className="text-[#94A3B8] hover:text-[#22D3EE] transition-colors duration-300"
        >
          Resend OTP
        </button>
      </div>
    </div>
  </div>
</div>

  );
};

export default VerifyEmail;
