import axios from "axios";

const axiosInstance = axios.create({
      withCredentials: true,
});

export async function apiConnector(method,url,bodyData,headers,params){
      console.log("url :"+ url)

    return await axiosInstance({ 
        method:`${method}`,
        url:`${url}`,
        headers:headers?(headers):(null),                   
        data:bodyData?(bodyData):(bodyData),
        withCredentials:true
    })
}
