
import myLogo from "../../assets/asset0.png";
import { FaLongArrowAltRight, FaBars, FaBookOpen, FaWindowClose} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { useState } from "react";
import Modal from "../ui/Modal";

function Navbar() {
 const {user, isAuthenticated, logout, logoutError, logoutLoading, clearLogoutError } = useAuth();
 const [showMenu, setShowMenu] = useState(false);
 const [showMobileMenu, setShowMobileMenu] = useState(false);
 const [showLogoutModal, setShowLogoutModal] = useState(false);


  return (
    <>
    <nav className="p-3 bg-white flex justify-between items-center border border-gray-100">
        <Link to="/" className="flex items-center gap-2 flex-1">
            <img className="object-cover max-w-12 max-h-12" src={myLogo} alt=""/>
            <span className="text-lg font-medium font-display ">Blogify</span>
        </Link>

        {/* <!-- nav-menu --> */}

        <div id="nav-menu" className="hidden lg:flex gap-12">
            <Link className="font-medium  hover:text-primary">Pricing</Link>
            <Link  className="font-medium  hover:text-primary">Docs</Link>
            <Link  className="font-medium  hover:text-primary">Changelog</Link>
            <Link  className="font-medium  hover:text-primary">Blogs</Link>
        </div>

        <div className="flex-1 hidden lg:flex gap-2 items-center  lg:justify-end  ">
                    {isAuthenticated && (
                        <Link to="/create-blog"
                            className="flex items-center gap-1 px-6 py-2 border border-gray-400 rounded-lg hover:border-gray-600 ">
                                    <FaBookOpen className=""/>
                                    <span>Write</span>
                                    <FaLongArrowAltRight />
                        </Link>
                    )}
          {
            !isAuthenticated? (
            <Link to="/login" className=" px-6 py-2 rounded-lg bg-primary text-white font-semibold shadow-sm hover:bg-opacity-90 hover:opacity-90" >login</Link>
            ): (
             <div className="relative">
                <button id="hidden lg: block profile-image-div"className="h-10 w-10 border rounded-full border-gray-400 "
                onClick={()=>{setShowMenu(prev=>!prev)}}
                >
                    <img id="profile-image" src={ user.profileImageURL[0] === "/"?`http://localhost:8004${user.profileImageURL}`: user.profileImageURL} className="object-cover w-full h-full  rounded-full" />
                </button>

                {showMenu && (
                    <div className="absolute flex flex-col top-full right-full bg-white mt-2 py-2 border border-gray-100 rounded-lg">
                        <Link to="/dashboard" className=" px-4 py-1 rounded-lg hover:bg-gray-100 font-medium text-gray-500">
                            {user?.username}
                        </Link>
                         <button  className=" px-4 py-1 rounded-lg hover:bg-gray-100 font-medium text-gray-500"
                         onClick={()=>{
                            clearLogoutError();
                            setShowLogoutModal(true);
                         }}
                         >
                            logout
                        </button>
                    </div>
                )}
             </div>)
          }
        </div>
         
         {/* pop up model */}
        <Modal
        isOpen={showLogoutModal}
        onClose={()=>{
             if (logoutLoading) return;
             setShowLogoutModal(false);
             clearLogoutError();
        }}
        title="Logout">
        <p className="text-gray-600">
            Are you sure you want to logout?
        </p>
        
        <div className="mt-6 flex justify-end gap-3">
            <button
                type="button"
                onClick={() => setShowLogoutModal(false)}
                className="
                    rounded-lg
                    border
                    border-gray-300
                    px-4
                    py-2
                    text-sm
                    font-medium
                    hover:bg-gray-50
                "
            >Cancel</button>
            <button
                type="button"
                disabled = {logoutLoading}
                onClick={async () => {
                    try {
                        await logout();
                        setShowLogoutModal(false);
                    } catch (error) {
                        // nothing to do 
                    }
                }}
    
                className="
                   cursor-pointer px-8 py-3 rounded-lg bg-primary text-white font-semibold shadow-sm hover:bg-opacity-90 disabled:opacity-60 disabled:cursor-not-allowed
                "
            >
                {logoutLoading? "logging out..." :"logout"}
            </button>

            </div>
            {/* error  */}
            {logoutError && (
            <p className="text-sm text-red-600 ">{logoutError}</p>
        )}
        </Modal>
        <button className="p-2 lg:hidden cursor-pointer" 
        onClick={()=>{setShowMobileMenu(prev=>!prev)}}
        >
           <FaBars/>
        </button>
        
        <div id="nav-dialog" className={`${ showMobileMenu?"":"hidden"} fixed lg:hidden  inset-0 bg-white p-3`} >
         <div className="flex justify-between items-center">
                <Link to="/" className="flex items-center gap-2 flex-1">
               <img className="object-cover max-w-12 max-h-12" src={myLogo} alt=""/>
                <span className="text-lg font-medium font-display ">Blogify</span>
            
              </Link>
                <button className="p-2 lg:hidden cursor-pointer" 
                onClick={()=>{setShowMobileMenu(prev=>!prev)}}
                >
                 <FaWindowClose />
                 </button>                
              </div>

            <div className="mt-6">
                <Link  className="block font-medium m-3 p-3 hover:bg-gray-50 rounded-lg">Pricing</Link>
                <Link  className="block font-medium m-3 p-3 hover:bg-gray-50 rounded-lg">Docs</Link>
                <Link  className="block font-medium m-3 p-3 hover:bg-gray-50 rounded-lg">Changelog</Link>
                <Link  className="block font-medium m-3 p-3 hover:bg-gray-50 rounded-lg">Blogs</Link>

                { !user ? (
                <Link to="/login"  className="block font-medium m-3 p-3 hover:bg-gray-50 rounded-lg">Login</Link>
                ):(
                <button type="button" className="block font-medium m-3 p-3 hover:bg-gray-50 rounded-lg"
                onClick={()=> setShowLogoutModal(true)}
                >logout</button>
                )}
            </div>

            <div className="h-[1px] bg-gray-300"></div>

            {
                user && (
               <button
                className=" w-full mt-6 flex gap-2 items-center px-6 py-4  hover:bg-gray-50 rounded-lg hover:border-gray-600">
               <div className="h-10 w-10 border rounded-full border-gray-400 "
                >
                    <img id="profile-image" src={ user.profileImageURL[0] === "/"?`http://localhost:8004${user.profileImageURL}`: user.profileImageURL} className="object-cover w-full h-full  rounded-full" />
                </div>
                <span className="font-medium">{user.username}</span>
            </button>
                )
            }
            
        </div>
    </nav>
    </>
  )
}

export default Navbar