import {setAccessToken, getAccessToken, clearAccessToken } from "./authStore"

const url = "http://localhost:8004/api";



// Http error handling for the apiFetch
const createApiError = async (response)=>{
    let data = null;
    try {
         data  = await response.json();
    } catch (error) {
        // nothing to do
    }

    const error = new Error(data?.message || "something went wrong" );
    error.status = response.status;
    error.data = data;
    return error;
}


// main generic api

export const apiFetch= async (endpoint, options = {}, retry = true)=>{
    //options={ method:"", body: {}, headers: {}, }

    // creating new header --> cleaner
    const headers = {
        ...options?.headers
    }

    if(!(options.body instanceof FormData)){
        headers["Content-Type"] = "application/json";
    }
    const accessToken = getAccessToken();
    if(accessToken) headers.Authorization = `Bearer ${accessToken}`;
    // main fetch
    const response = await fetch(`${url}${endpoint}`, {
        ...options,
        headers,
        credentials: "include"
    });

    if(response.ok){
        const data = await response.json();
        return data;
    };

    if(response.status == 401  && retry ){
        // retry the request
        // ask the backend for the new accessToken
        try {
            const resfreshResponse = await fetch(`${url}/auth/refresh-token`, {
            method: "POST",
            credentials: "include"
               });

            if(!resfreshResponse.ok) throw await createApiError(resfreshResponse);
            //setting new accessToken 
            const refreshReponseData = await resfreshResponse.json();
            const newAccessToken = refreshReponseData.accessToken;
            setAccessToken(newAccessToken);

            return apiFetch(endpoint, options, false);

        } catch (error) {
            clearAccessToken();
            throw error;
        }
        
    } ;

    // other http error handling
    throw  await createApiError(response);
} 