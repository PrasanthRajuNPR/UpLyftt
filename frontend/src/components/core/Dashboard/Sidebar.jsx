import React, { useState } from "react";
import {sidebarLinks} from "../../../data/dashboard-links"
import {  useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import SidebarLink from "./SidebarLink";
import { logOut } from "../../../services/operations/authAPI";
import { VscSignOut } from "react-icons/vsc"
import ConfirmationModel from "../../common/ConfirmationModal";
import { motion } from 'framer-motion';
const Sidebar = ()=>{
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const {user,loading:profileLoading} = useSelector((state)=>state.profile);
    const {loading:authLoading} = useSelector((state)=>state.auth);
    const [confirmationModal,setConfirmationModel] = useState('');
    if(profileLoading || authLoading){
        return(
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
        )
    }

    return(
        <>
            <div className="flex h-[calc(100vh-3.5rem)] min-w-[220px] flex-col border-r-[1px] border-r-richblack-700 bg-richblack-800 py-10">
                <div className="flex flex-col">
                    {sidebarLinks.map((link) => {
                        if (link.type && user?.accountType !== link.type) return null
                        return (
                        <SidebarLink key={link.id} link={link} iconName={link.icon} />
                        )
                    })}
                </div>
                <div className="mx-auto mt-6 mb-6 h-[1px] w-10/12 bg-richblack-700" />
                    <div className="flex flex-col">
                    <SidebarLink
                        link={{ name: "Settings", path: "/dashboard/settings" }}
                        iconName="VscSettingsGear"
                    />
                    <button 
                            onClick={()=>setConfirmationModel({
                                text1:"Are u sure ?",
                                text2:"You will be logged out",
                                btn1Text:"Logout",
                                btn2Text:"Cancel",
                                btn1Handler:()=>dispatch(logOut(navigate)),
                                btn2Handler:()=>setConfirmationModel(null),
                            })}
                            className="px-8 py-2 text-sm font-medium text-richblack-300"
                            >
                                <div className="flex items-center gap-x-2 text-richblack-300">
                                    <VscSignOut className="text-lg" />
                                    <span>Logout</span>
                                </div>
                    </button>
                </div>
            </div>
            {confirmationModal && <ConfirmationModel modalData={confirmationModal} />}
        </>
    )
}
export default Sidebar