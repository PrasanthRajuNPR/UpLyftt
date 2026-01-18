import {createSlice} from "@reduxjs/toolkit";

const initialState ={
    signUpData:null,
    loading:false,
    token:localStorage.getItem("token")?(JSON.parse(localStorage.getItem("token"))) : (null),
}

const authSlice = createSlice({
    name:"auth",
    initialState:initialState,
    reducers:{
        setToken (state,action){
            console.log("payload :",action.payload)
            state.token = action.payload
        },
        setLoading (state,action){
            state.loading  = action.payload;
        },
        setSignupData (state,action){
            state.signUpData = action.payload;
        }
    }
})

export const {setToken,setLoading,setSignupData} = authSlice.actions;

export default authSlice.reducer;