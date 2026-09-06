import { BrowserRouter, Routes, Route } from "react-router-dom"
import ProtectedRoute from "./ProtectedRoute"
import PublicRoute from "./PublicRoute"
import Login from "../features/auth/pages/Login"
import Home from "../pages/Home";
import BlogDetails from "../features/blogs/pages/BlogDetails";
import Register from "../features/auth/pages/Register";
import MainLayout from "../pages/MainLayout";
import CreateBlog from "../features/blogs/pages/createBlog";
import Dashboard from "../pages/Dashboard";
import EditBlog from "../features/blogs/pages/EditBlog";
import AdminRoute from "./AdminRoute";
import AdminDashboard from "../features/admin/pages/AdminDashboard";


function AppRoutes() {
  console.log("inside the approute");
  return (
    <BrowserRouter>
    <Routes>
    {/* public routes  for everyone */}
    <Route element={<MainLayout/>}>
        <Route path="/blogs/:id" element={<BlogDetails/>}/>
        <Route path="/" element={<Home/>}/>
    </ Route>

    {/* Public Only when logged out */}
        <Route element={<PublicRoute/>}>
            <Route path="/login" element={<Login />}/>
            <Route path="/register" element={<Register />} />
        </ Route>

    {/* Protected routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/dashboard" element={<Dashboard/>}/>
          <Route path="/create-blog" element={<CreateBlog/>}/>
          <Route path="/blogs/:id/edit" element={<EditBlog/>}/>
        </Route>
     </Route>
      <Route element={<AdminRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Route>
      </Route>
    </Routes>
    </ BrowserRouter>
  )
}

export default AppRoutes