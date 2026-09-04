import { Outlet } from "react-router-dom"
import Navbar from "../components/layout/Navbar"
function MainLayout() {
  return (
    <div>
        <Navbar/>
        <Outlet/>
    </div>
  )
}

export default MainLayout