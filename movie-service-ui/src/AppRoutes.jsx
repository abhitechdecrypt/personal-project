import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, matchPath } from "react-router-dom";
import Slider from "./components/Slider";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import About from "./pages/About";
import LoginPage from "./pages/Loginpage";
import UserRegister from "./pages/UserRegister";
import NotAuthorized from "./pages/NotAuthorized"; // Create this page
import PrivateRoute from "./PrivateRoute"; // Adjust path as needed
import AddMovies from "./pages/AddMovies";
import EditMovies from "./pages/EditMovies";
import DeleteMovies from "./pages/DeleteMovies";
import UserDashboard from "./pages/UserDashboard";
import { excludedPaths } from "./CONSTANT";
import ViewCinema from "./pages/ViewCinema";
import AddCinema from "./pages/AddCinema";
import BookMovies from "./pages/BookMovies";
import BookingHistory from "./pages/BookingHistory";

const useShowSlider = () => {
   const location = useLocation();
 
   const isExcludedPath = excludedPaths.some(pattern => 
     matchPath({ path: pattern, end: false }, location.pathname)
   );
 
   return !isExcludedPath;
 };
function AppRoutes() {
   // const location = useLocation();
   const showRightArrow = useShowSlider();

   // const showSlider = !excludedPaths.includes(location.pathname);
   
   return (
      <>
         <Navbar />
         {showRightArrow && <Slider />}
         <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/movie-details" element={<About />} />
            <Route path="/user-login" element={<LoginPage />} />
            <Route path="/user-register" element={<UserRegister />} />
            <Route path="/user-dashboard" element={<PrivateRoute element={UserDashboard} />}/>
            <Route path="/not-authorized" element={<NotAuthorized />} />
            <Route
               path="/add-movies"
               element={<PrivateRoute element={AddMovies} requiredRole="ADMIN" />}
            />
            <Route
               path="/booking-history"
               element={<PrivateRoute element={BookingHistory} requiredRole="USER" />}
            />
            <Route
               path="/book-movies/:id"
               element={<PrivateRoute element={BookMovies} requiredRole="USER" />}
            />
            <Route
               path="/add-cinema"
               element={<PrivateRoute element={AddCinema} requiredRole="ADMIN" />}
            />
            <Route
               path="/edit-movies"
               element={<PrivateRoute element={EditMovies} requiredRole="ADMIN" />}
            />
            <Route
               path="/delete-movies"
               element={<PrivateRoute element={DeleteMovies} requiredRole="ADMIN" />}
            />
            <Route
               path="/block-cinema"
               element={<PrivateRoute element={ViewCinema} requiredRole="ADMIN" />}
            />
         </Routes>
         <Footer />
      </>
   );
}

export default function App() {
   return (
      <Router>
         <AppRoutes />
      </Router>
   );
}
