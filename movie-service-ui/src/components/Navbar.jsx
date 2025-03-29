import React, { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import CustomDialog from "./CustomDialog";
import { useAuth } from "../Login/AuthProvider";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { FaUserCircle } from "react-icons/fa";
import * as user_link from "../CONSTANT";
import Swal from "sweetalert2";
import { MdOutlineKeyboardArrowDown } from "react-icons/md";

const Navbar = () => {
   const [isOpen, setIsOpen] = useState(false);
   const [dialogOpen, setDialogOpen] = useState(false);
   const [username, setUsername] = useState("");
   const { login, loading, user } = useAuth();
   const [userRole, setUserRole] = useState("");

   useEffect(() => {
      // Retrieve user data from cookies on component mount
      const token = Cookies.get("token");
      if (token) {
         try {
            const decoded = jwtDecode(token);
            const expInMillis = decoded.exp * 1000;

            // Get current time in milliseconds
            const nowInMillis = Date.now();
            if (nowInMillis > expInMillis) {
               Swal.fire({
                  title: "Session Expired!",
                  text: "Session Expired, Please Login to use the new session",
                  icon: "warning",
                  confirmButtonText: "Login",
                  // Use preConfirm to handle actions before closing the alert
                  preConfirm: () => {
                     // Clear the cookies and perform logout actions
                     Cookies.remove("token"); // Remove the token cookie
                     setUsername(""); // Clear the username state
                     setUserRole(""); // Clear the user role state

                     // Optionally, you can redirect the user to the login page
                     window.location.href = "/user-login";
                  },
               });
            }
            setUserRole(decoded?.userData?.userRole || "");
            setUsername(decoded.userData?.username || "");
         } catch (e) {
            console.error("Failed to decode token:", e);
         }
      }
   }, [user]);

   const toggleMenu = () => {
      setIsOpen(!isOpen);
   };
   const handleLogout = () => {
      Cookies.remove("token");
      setUsername("");
      setUserRole("");
      window.location.reload();
      // Additional logout logic if needed
   };

   const renderMenuItems = () => {
      const menuItems = userRole === "ADMIN" ? user_link.ADMIN_CONSTANT : user_link.USER_CONSTANT;
      return menuItems.map((item) => (
         <NavLink key={item.href} to={item.href} className="block px-4 py-2 hover:bg-gray-700">
            {item.text}
         </NavLink>
      ));
   };


   const scrollToMovieSection = () => {
      const movieSectionRef = document.getElementById("movie-section");
      if (movieSectionRef) {
         movieSectionRef.scrollIntoView({ behavior: 'smooth' });
      }
   };
   return (
      <nav className="bg-gray-800 p-3 flex items-center justify-between">
         {/* Logo and Desktop Links */}
         <div className="flex items-center space-x-4">
            <Link to="/" className="text-white text-2xl font-bold">
               E-Movie
            </Link>
         </div>

         {/* Centered Search Input */}
         <div className="flex-grow flex justify-center">
            <div className="relative max-w-xs w-full">
               <input
                  type="text"
                  placeholder="Search movies ... "
                  className="bg-slate-400 text-slate-950 px-4 py-1 rounded-full placeholder-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
               />
               <button
                  type="button"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
               >
                  🔍
               </button>
            </div>
         </div>

         {/* Desktop Menu */}
         <div className="hidden md:flex items-center space-x-4">
            <Link to="/" className="text-white text-lg py-2" onClick={toggleMenu}>
               Home
            </Link>

            {username && window.location.pathname !=="/"? (<Link to="/" className="text-white text-lg py-2" onClick={toggleMenu}>Movies</Link>):
            (<a href="#movie-section" onClick={(e) => {
               e.preventDefault(); // Prevent default anchor behavior
               scrollToMovieSection();
            }} className="text-white text-lg py-2">
               Movies
            </a>)}
         </div>

         {/* User Menu */}
         {username ? (
            <div className="relative group z-50">
               <button className="text-white flex items-center ml-3 space-x-2 p-2 hover:bg-gray-700 rounded-full">
                  <FaUserCircle />
                  <span>{username}</span>
                  <MdOutlineKeyboardArrowDown className="text-2xl hover:skew-y-0"/>
               </button>
               <div className="absolute right-0 mt-0 bg-gray-800 text-white rounded-md shadow-lg w-48 hidden group-hover:block">
                  <NavLink to="/user-dashboard" className="block px-4 py-2 hover:bg-gray-700">
                     Profile
                  </NavLink>
                  {renderMenuItems()}
                  <button
                     className="block w-full px-4 py-2 text-left hover:bg-gray-700"
                     onClick={handleLogout}
                  >
                     Logout
                  </button>
               </div>
            </div>
         ) : (
            <div className="hidden ml-2 md:flex items-center space-x-4">
               <Link
                  to="/user-login"
                  className="bg-lime-700 text-white px-4 py-2 rounded-full hover:bg-lime-900 transition-all"
               >
                  Login
               </Link>
               <Link
                  to="/user-register"
                  className="bg-cyan-400 text-white px-4 py-2 rounded-full hover:bg-cyan-900 transition-all"
               >
                  Sign Up
               </Link>
            </div>
         )}

         {/* Mobile Menu Toggle */}
         <button className="md:hidden text-white ml-4" onClick={toggleMenu}>
            ☰
         </button>

         {/* Mobile Menu */}
         {isOpen && (
            <div className="fixed inset-0 bg-gray-800 bg-opacity-100 z-50 md:hidden">
               <button className="absolute top-4 right-4 text-white text-2xl" onClick={toggleMenu}>
                  ✕
               </button>
               <div className="flex flex-col items-center pt-10">
                  <Link to="/" className="text-white text-2xl py-2" onClick={toggleMenu}>
                     Home
                  </Link>
                  <Link to="/" className="text-white text-2xl py-2" onClick={toggleMenu}>
                     Movies
                  </Link>
                  {username ? (
                     <>
                        <NavLink
                           to="/user-dashboard"
                           className="text-white text-2xl py-2"
                           onClick={toggleMenu}
                        >
                           Profile
                        </NavLink>
                        <button
                           className="bg-red-500 text-white px-4 py-2 mt-4 rounded-md hover:bg-red-600"
                           onClick={handleLogout}
                        >
                           Logout
                        </button>
                     </>
                  ) : (
                     <div className="flex flex-col items-center">
                        <Link
                           to="/user-login"
                           className="bg-lime-700 text-white px-4 py-2 rounded-full hover:bg-lime-900 transition-all"
                           onClick={toggleMenu}
                        >
                           Login
                        </Link>
                        <Link
                           to="/user-register"
                           className="bg-cyan-400 mt-3 text-white px-4 py-2 rounded-full hover:bg-cyan-900 transition-all"
                           onClick={toggleMenu}
                        >
                           Sign Up
                        </Link>
                     </div>
                  )}
               </div>
            </div>
         )}
      </nav>
   );
};

export default Navbar;
