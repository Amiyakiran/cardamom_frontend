import { serverUrl } from './serverUrl'; // Import the server URL
import { commonApi } from './commonApi'; // Import the common API function

//common request

//register api
export const registerApi = async (body) => {
  try {
      return await commonApi("POST", `${serverUrl}/register`, body);
     
  } catch (error) {
    return error;
  }
};

//login api
export const loginApi = async (body) => {
    try {
        return await commonApi("POST", `${serverUrl}/login`, body);
        
    } catch (error) {
        return error;
    }
}
//to get the username and email of the logged in user
export const getMeApi = async () => {
  try{
    return await commonApi("GET", `${serverUrl}/me`);
  } catch (error) {
    return error;
  }
}

//logout api
export const logoutApi = async () => {
  try {
    return await commonApi("POST", `${serverUrl}/logout`);
  } catch (error) {
    return error;
  }
}

//googlelogin
export const googleLoginApi = async(body)=>{
  try {
        return await commonApi("POST", `${serverUrl}/google_login`, body);
        
    } catch (error) {
        return error;
    }
}

//forgotPassword
export const forgotPasswordApi = async(body)=>{
  try {
        return await commonApi("POST", `${serverUrl}/forgot_password`, body);
        
    } catch (error) {
        return error;
    }
}
//----------------------------------------------------------

//customer

//send message
export const sendMessageApi = async(body)=>{
  try {
    return await commonApi('POST',`${serverUrl}/sendmessage`,body)
    
  } catch (error) {
    return error
  }
}

//----------------------------------------------------------

//admin

//add blog
export const addBlogApi = async(body, reqHeader)=>{
   try {
    return await commonApi('POST',`${serverUrl}/add-blog`,body, reqHeader)
    
  } catch (error) {
    return error
  }
}