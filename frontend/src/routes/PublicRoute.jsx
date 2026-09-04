import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

function PublicRoute() {
    console.log("inside the publicroute");
    const {loading, isAuthenticated} = useAuth();
    if(loading){
        return <div className="flex min-h-screen items-center justify-center">...Loading</div>
    };
    if(isAuthenticated){
        console.log("authenticated user");
        return (<Navigate to="/" replace />)
    }
    // Not logged in → allow public page
    return <Outlet/>;
}

export default PublicRoute
