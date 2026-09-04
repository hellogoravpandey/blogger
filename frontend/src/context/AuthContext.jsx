import { createContext, useContext, useEffect, useState } from "react"
import { clearAccessToken, getAccessToken, setAccessToken } from "../services/authStore";
import { loginUser, logoutUser, getCurrentUser,  getRefreshToken, registerUser} from "../features/auth/auth.api";

const AuthContext = createContext(null);

export const AuthProvider =  ({children })=>{
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [logoutLoading, setLogoutLoading] = useState(false);
    const [logoutError, setlogoutError] = useState("");
    const [loginLoading, setLoginLoading] = useState(false);
    const [loginError, setloginError] = useState("");
    const [registerLoading, setRegisterLoading] = useState(false);
    const [registerError, setRegisterError] = useState("");
    console.log("user in authContext", user);


    useEffect(()=>{
        const initializeAuth = async ()=>{
            try {
                setLoading(true);
                // is user already logged in ?? get new AccessToken
                const data = await getRefreshToken();
                setAccessToken(data.accessToken);

                //ask backend for user 
                const userData = await getCurrentUser();
                setUser(userData.user);

            } catch (error) {
                console.log("error inside the intialieauth", error);
                setAccessToken(null);
                setUser(null);
            }
            finally{
                setLoading(false);
            }
        };
        initializeAuth();
    }, [])


    // login
    const login = async (credentials)=>{
        // 1. backend login
        // 2. set access token
        try {
            setLoginLoading(true);
            const data = await loginUser(credentials);
            setAccessToken(data.accessToken);
            const userData=  await getCurrentUser();
            setUser(userData.user);
        } catch (error) {
            setloginError(error.message);
        }
        finally{
            setLoginLoading(false);
        }
        
    };


    const logout = async ()=>{
        // 1. clearAcessToken 
                // 1. throws error ?? 
                // 2. but we have to clearAcecesToken =?? how ?? 
                // 3. try finally 
        // 2. logout from the backend 
        // api.js ==> handles all the error
        try {
            setLogoutLoading(true);
            setlogoutError("");
            await logoutUser();
            clearAccessToken();
            setUser(null);
        } 
        catch(error){
            console.log("error in logout", error.message);
            setlogoutError(error.message);  // backend message
            throw error;
        }
        finally { 
            setLogoutLoading(false);
        }   
    };

    const clearLogoutError = ()=>{
        setlogoutError("");
    }

    const clearLoginError = ()=>{
        setloginError("");
    }

    const clearRegisterError = ()=>{
        setRegisterError("");
    }


    const register = async (userData)=>{
        try {
            setRegisterError("");
            setRegisterLoading(false);
            await registerUser(userData);
        } catch (error) {
            setRegisterError(error.message);
            throw error;
        }
        finally{
            setRegisterLoading(false);
        }
    }
    

    const updateUserBookmark = (blogId, bookmarked)=>{
        setUser(prev=>(
            {
                ...prev,
                bookmarks: bookmarked
                ? [...prev.bookmarks, blogId]
                : prev.bookmarks.filter(id=>id !== blogId)
            }
        ))
    }


    const value = {
        user,
        loading,
        isAuthenticated:  user?true:false,  
        // functions
        register,
        login,
        logout,
        
        registerError,
        registerLoading,
        clearRegisterError,

        logoutError,
        logoutLoading,
        clearLogoutError,

        loginError,
        loginLoading,
        clearLoginError,

        updateUserBookmark
    };



    return (
     <AuthContext.Provider value={value}> {children } </ AuthContext.Provider>
    )

}



export const useAuth = ()=>{
    return useContext(AuthContext);
}
