import { useAuth } from "../context/AuthContext"
import {Outlet, NavLink} from "react-router-dom" 
function  ProtectedRoute() {
   const {isAuthenticated, loading} = useAuth();
   
   if(loading){
    return (
    <div className="flex min-h-screen items-center justify-center"> ....loading</div> // or we can make loading component
    );
   }

   //no loading, but not logged in 
   if(!isAuthenticated){
    return (
        <NavLink  to="/login" replace/>
    )
   }

   return <Outlet/>
}

export default ProtectedRoute;