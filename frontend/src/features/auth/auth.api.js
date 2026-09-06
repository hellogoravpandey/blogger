import { apiFetch  } from "../../services/api";

// services ?? 
// login, logout 

export const registerUser = async (userData)=>{
    return apiFetch("/auth/register", {
        method: "POST",
        body: JSON.stringify(userData)
    } )
};


export const loginUser = async (userData)=>{
    return apiFetch("/auth/login", {
        method: "POST",
        body: JSON.stringify(userData)
    })
}


export const logoutUser = async ()=>{
    return apiFetch("/auth/logout", {
        method: "POST"
    });
}



export const getCurrentUser = () => {
    return apiFetch(
        "/auth/me"
    );

};

export const getUserDashboard = () => apiFetch("/auth/dashboard");


export const getRefreshToken = () => {
    return apiFetch(
        "/auth/refresh-token",
        {
            method: "POST"
        }
    );

};

