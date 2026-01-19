import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { resetPassword } from "../services/operations/authAPI";
import { useLocation ,Link} from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai"
import { BiArrowBack } from "react-icons/bi"
import { motion } from 'framer-motion';
const UpdatePassword = () =>{

    const [showPassword,setShowPassword] = useState(false)
    const [showConfirmPassword,setShowConfirmPassword] = useState(false)

    const dispatch = useDispatch();
    const location = useLocation();

    const {loading} = useSelector((state)=>state.auth);
    const [formData,setFormData]=useState({
        password:"",
        confirmPassword:""
    }) 
    
    const {password,confirmPassword} = formData;
    useEffect(()=>{
        console.log(password)
    },[formData])
    const handleOnChange =(event)=>{
        setFormData((prevData)=>({
            ...prevData,
            [event.target.name]:event.target.value
        }))
    }
    const handleOnSubmit = (event)=>{
        console.log(location)
        event.preventDefault();
        const token = location.pathname.split("/").at(-1);
        dispatch(resetPassword(password,confirmPassword,token))
    }
    return(
        <div className="grid min-h-[calc(100vh-3.5rem)] place-items-center">
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
        <div className="max-w-[500px] p-4 lg:p-8">
          <h1 className="text-[1.875rem] font-semibold leading-[2.375rem] text-richblack-5">
            Choose new password
          </h1>
          <p className="my-4 text-[1.125rem] leading-[1.625rem] text-richblack-100">
            Almost done. Enter your new password and youre all set.
          </p>
          <form onSubmit={handleOnSubmit}>
            <label className="relative ">
              <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                New Password <sup className="text-pink-200">*</sup>
              </p>
              <input
                required
                type={showPassword ? "text" : "password"}
                name="password"
                value={password}
                onChange={handleOnChange}
                placeholder="Enter Password"
                className="form-style w-full !pr-10 h-[30px] "
              />
              <span
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-[29px] z-[10] cursor-pointer"
              >
                {showPassword ? (
                  <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                ) : (
                  <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                )}
              </span>
            </label>
            <label className="relative mt-3 block">
              <p className="mb-1 text-[0.875rem] leading-[1.375rem] text-richblack-5">
                Confirm New Password <sup className="text-pink-200">*</sup>
              </p>
              <input
                required
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={confirmPassword}
                onChange={handleOnChange}
                placeholder="Confirm Password"
                className="form-style w-full !pr-10 h-[30px]"
              />
              <span
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-3 top-[29px] z-[10] cursor-pointer"
              >
                {showConfirmPassword ? (
                  <AiOutlineEyeInvisible fontSize={24} fill="#AFB2BF" />
                ) : (
                  <AiOutlineEye fontSize={24} fill="#AFB2BF" />
                )}
              </span>
            </label>

            <button
              type="submit"
              className="mt-6 w-full rounded-[8px] bg-yellow-50 py-[12px] px-[12px] font-medium text-richblack-900"
            >
              Reset Password
            </button>
          </form>
          <div className="mt-6 flex items-center justify-between">
            <Link to="/login">
              <p className="flex items-center gap-x-2 text-richblack-5">
                <BiArrowBack /> Back To Login
              </p>
            </Link>
          </div>
        </div>
      )}
    </div>
    )
}

export default UpdatePassword