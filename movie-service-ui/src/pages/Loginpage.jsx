// src/pages/LoginPage.js
import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../Login/AuthProvider";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const LoginPage = () => {
   const [email, setEmail] = useState("");
   const [password, setPassword] = useState("");
   const navigate = useNavigate();
   const location = useLocation();
   const [contact, setContact] = useState("");
   const [username, setUsername] = useState("");
   const { login, loading, user } = useAuth();
   
   // Store the previous location in state
   const from = location.state?.from?.pathname || "/";

   useEffect(() => {
      // Retrieve user data from cookies on component mount
      const token = Cookies.get("token");
      if (token) {
         try {
            const decoded = jwtDecode(token);
            setUsername(decoded.userData?.username || "");
         } catch (e) {
            console.error("Failed to decode token:", e);
         }
      }
   }, [user]);

   const handleLogin = async (event) => {
      event.preventDefault();
      const loginData = {
         email: contact,
         password,
      };

      try {
         await login(loginData);
         navigate('/');
      } catch (error) {
         toast.error(error);
         console.error("Login failed:", error);
      }
   };

   return (
      <div className="flex items-center justify-center min-h-screen bg-white">
         <div className="w-full max-w-lg bg-slate-200 p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
            <form onSubmit={handleLogin}>
               <div className="mb-4 m-2">
                  <label htmlFor="contact" className="block text-gray-700">
                     Email or Phone Number
                  </label>
                  <input
                     type="text"
                     id="contact"
                     className="w-full p-2 border border-gray-300 rounded-md"
                     placeholder="Enter your email or phone number"
                     value={contact}
                     onChange={(e) => setContact(e.target.value)}
                     required
                  />
               </div>
               <div className="mb-4 m-2">
                  <label htmlFor="password" className="block text-gray-700">
                     Password
                  </label>
                  <input
                     type="password"
                     id="password"
                     className="w-full p-2 border border-gray-300 rounded-md"
                     placeholder="Enter your password"
                     value={password}
                     onChange={(e) => setPassword(e.target.value)}
                     required
                  />
               </div>
               <div className="mb-4 m-2">
                  <button
                     type="submit"
                     className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
                     disabled={loading}
                  >
                     {loading ? "Logging in..." : "Continue"}
                  </button>
               </div>
            </form>
            <p className="mt-4 text-center">
               Don't have an account?{" "}
               <a href="/user-register" className="text-blue-500 hover:underline">
                  Register
               </a>
            </p>
         </div>
      </div>
   );
};

export default LoginPage;
