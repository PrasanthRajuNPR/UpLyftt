import { toast } from "react-hot-toast"
import { setLoading,setToken } from "../../redox/slices/authSlice";
import { setUser } from "../../redox/slices/profileSlice";
import { apiConnector } from "../apiconnector";
import { loginApi } from "../apis";
import { signUpApi } from "../apis";
import { resetCart } from "../../redox/slices/cartSlice";
import { Navigate } from "react-router-dom";

export function sendOtp(email,navigate){
    
    return async(dispatch)=>{
        const toastId = toast.loading("Loading...");

        dispatch(setLoading(true));
        
        try{
            const response = await apiConnector("POST",signUpApi.SENDOTP_API,{email});

            if(!response.data.success){
                throw new Error(response.data.message);
            }

            console.log("OTP API response : ",response);

            toast.success("OTP sent successfully");

            navigate("/verify-email");
        }
        catch(error){
            console.log("SENDOTP API ERROR............", error)
            toast.error("Could Not Send OTP")
        }
        dispatch(setLoading(false))
        toast.dismiss(toastId)
    }
}
export function login(email,password,navigate){
    return async (dispatch)=>{
        const toastId = toast.loading("Loading");

        dispatch(setLoading(true));


        try{
            const response = await apiConnector("POST",loginApi.LOGIN_API,{
                email,password 
            })

            console.log("Login API response cookies : ",document.cookie);

            if(response.data.message === "user does not exixts please signin first"){
                console.log("message : ",response.data.message)
                toast.dismiss(toastId);
                navigate("/signUp");
            }
            
            if (!response.data.success) {
                throw new Error(response.data.message)
            }

            toast.success("Login success");

            dispatch(setToken(response.data.data));

            const userImage = (response.data.user.image) ? (response.data.user.image) : (`https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.firstName} ${response.data.user.lastName}`);

            dispatch(setUser({...response.data.user,image:userImage}));

            localStorage.setItem("user",JSON.stringify(response.data.user));
            localStorage.setItem("token",JSON.stringify(response.data.data));
            const cookies = document.cookie; 
            console.log("Cookies:", cookies);
            toast.dismiss(toastId); 
            navigate("/dashboard/my-profile");

        }catch(error){
            console.log("LOGIN API ERROR............", error)
            toast.error("Login Failed")
            toast.dismiss(toastId); 
            navigate("/signUp")
        }
        dispatch(setLoading(false));
    }
}

export function signUp(accountType,firstName,lastName,email,password,confirmPassword,otp,navigate){
    return async (dispatch)=>{
        const toastId = toast.loading("Loading...");
        console.log(accountType,firstName,lastName,email,password,confirmPassword,otp)
        dispatch(setLoading(true));

        try{
            const response = await apiConnector("POST",signUpApi.SIGNUP_API,{firstName,lastName,email,password,confirmPassword,accountType,otp});

            if(!response.data.success){
                throw new Error(response.data.message)
            }

            console.log("signUp Api response : ",response);

            toast.success("SignUp Successfull");

            navigate("/login");
        }catch(error){
            console.log("Error occured in signUp API ...",error);
            toast.error("Signup Failed")
            navigate("/signUp");
        }
        dispatch(setLoading(false));
        toast.dismiss(toastId);
    }
}

export function logOut(navigate){
    return (dispatch)=>{
        dispatch(setToken(null));
        dispatch(setUser(null));
        dispatch(resetCart(null));
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        toast.success("Logged out successfull");
        navigate("/");
    }
}

export function getResetPasswordToken(email,setEmailSent){

    return async(dispatch)=>{
        dispatch(setLoading(true));
        try{
            const response = await apiConnector("POST",signUpApi.RESETPASSWORDTOKEN_API,{email}); 

            if(!response.data.success){
                throw new Error(response.data.message);
            }

            console.log("Reset Password TOken API response: ",response);

            toast.success("Reset-password-token generated");

            setEmailSent(true);
        }
        catch(error){
            console.log("RESET PASSWORD TOKEN Error", error);
            toast.error("Failed to send email for resetting password");
        }
        dispatch(setLoading(false));
    }
}

export function resetPassword(password,confirmPassword,token){

    return async (dispatch)=>{
        const toastId = toast.loading("Loading ....");
        const resetPassToken = token
        dispatch(setLoading(true));
        try{
            const response = await apiConnector("POST",signUpApi.RESETPASSWORD_API,{password,confirmPassword,resetPassToken});

            if(!response.data.success){
                throw new Error(response.data.message);
            }

            console.log("resetPassword API response : ",response);

            toast.success("Password reset successfull");


        }catch(error){
            console.log("RESET PASSWORD TOKEN Error", error);
            toast.error("Unable to reset password");
        }
        dispatch(setLoading(false));
    }
}

