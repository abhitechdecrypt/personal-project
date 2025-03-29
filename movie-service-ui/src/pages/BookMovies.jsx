import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { bookMovies, getMoviesById } from "../services/service"; // Ensure you have the bookMovie service
import Swal from "sweetalert2";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function BookMovies() {
   const { id } = useParams();
   const [movie, setMovie] = useState(null);
   const [cinemas, setCinemas] = useState([]);
   const [userData, setUserData] = useState(null);
   const navigate = useNavigate();

   useEffect(() => {
      const fetchMovieData = async () => {
         try {
            const movieData = await getMoviesById(id);
            setMovie(movieData);
            setCinemas(movieData.cinemas.filter((cinema) => !cinema.blocked));
         } catch (e) {
            console.error("Error fetching movie:", e);
         }
      };

      const getUserData = Cookies.get("token");
      const userInfo = jwtDecode(getUserData);
      console.log(userInfo);
      setUserData(userInfo?.userData || {});

      fetchMovieData();
   }, [id]);

   // Formik setup
   const formik = useFormik({
      initialValues: {
         cinema: "",
         seats: 1,
         date: "",
      },
      validationSchema: Yup.object({
         cinema: Yup.string().required("Cinema is required"),
         seats: Yup.number()
            .min(1, "At least 1 seat is required")
            .max(100, "You are allowed to book only up to 100 seats at a time")
            .required("Number of seats is required"),
         date: Yup.string().required("Date is required"),
      }),
      onSubmit: async (values) => {
         if (!values.cinema || !values.date) {
            Swal.fire({
               title: "Incomplete Information",
               text: "Please select a cinema and a booking date to proceed.",
               icon: "error",
               confirmButtonColor: "#3085d6",
               confirmButtonText: "Okay",
            });
            return;
         }

         try {
            const bookingDetails = {
               movieId: movie.id,
               cinemaId: parseInt(values.cinema),
               bookingDate: new Date(values.date).toISOString(), // Use selected date
               seats: values.seats,
               name: userData?.username,
               email: userData?.email,
               bookingStatus: "Pending",
            };

            await bookMovies(bookingDetails);
            navigate("/booking-history");

            Swal.fire({
               title: "Booking Confirmed",
               text: `Your booking for "${movie.title}" at the selected cinema on ${new Date(
                  values.date
               ).toLocaleDateString()} has been confirmed.`,
               icon: "success",
               confirmButtonColor: "#3085d6",
               confirmButtonText: "Okay",
            });

            // Reset form or redirect user as needed
            formik.resetForm();
         } catch (e) {
            console.error("Error booking movie:", e);
            Swal.fire({
               title: "Booking Failed",
               text: e,
               icon: "error",
               confirmButtonColor: "#3085d6",
               confirmButtonText: "Okay",
            });
         }
      },
   });

   // Format the movie's release date to 'YYYY-MM-DD'
   const minDate = movie ? new Date(movie.releasedDate).toISOString().split('T')[0] : "";

   return (
      <div className="max-w-3xl mx-auto p-4 bg-slate-300 rounded-lg shadow-md m-20">
         {movie ? (
            <div>
               <h2 className="text-2xl font-bold mb-4">Book Movie</h2>
               <div className="mb-4">
                  <img
                     src={movie.image}
                     alt={movie.title}
                     className="w-full h-96 mb-4 rounded-md"
                  />
                  <p className="text-lg font-semibold">{movie.title}</p>
                  <p className="text-lg">Director: {movie.director.trim()}</p>
                  <p className="text-lg">Genre: {movie.genre}</p>
                  <p className="text-lg">Release Date: {movie.releasedDate}</p>
                  <p className="text-lg">Duration: {movie.length} mins</p>
                  <p className="text-lg">Language: {movie.language}</p>
               </div>

               <form onSubmit={formik.handleSubmit}>
                  <div className="mb-4">
                     <label
                        htmlFor="cinema"
                        className="block text-sm font-medium text-gray-700 mb-2"
                     >
                        Select Cinema
                     </label>
                     <select
                        id="cinema"
                        name="cinema"
                        value={formik.values.cinema}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                     >
                        <option value="">Select a Cinema</option>
                        {cinemas.map((cinema) => (
                           <option key={cinema.id} value={cinema.id}>
                              {cinema.name} - {cinema.address} - {cinema.totalSeats}
                           </option>
                        ))}
                     </select>
                     {formik.touched.cinema && formik.errors.cinema ? (
                        <div className="text-red-500 text-sm">{formik.errors.cinema}</div>
                     ) : null}
                  </div>

                  <div className="mb-4">
                     <label
                        htmlFor="seats"
                        className="block text-sm font-medium text-gray-700 mb-2"
                     >
                        Number of Seats
                     </label>
                     <input
                        type="number"
                        id="seats"
                        name="seats"
                        value={formik.values.seats}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        min="1"
                        max="100"
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                     />
                     {formik.touched.seats && formik.errors.seats ? (
                        <div className="text-red-500 text-sm">{formik.errors.seats}</div>
                     ) : null}
                  </div>

                  <div className="mb-4">
                     <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                        Select Booking Date
                     </label>
                     <input
                        type="date"
                        id="date"
                        name="date"
                        value={formik.values.date}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        min={minDate}
                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                     />
                     {formik.touched.date && formik.errors.date ? (
                        <div className="text-red-500 text-sm">{formik.errors.date}</div>
                     ) : null}
                  </div>

                  <button
                     type="submit"
                     className="w-full bg-blue-500 text-white py-2 px-4 rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                     Book Now
                  </button>
               </form>
            </div>
         ) : (
            <p>Loading movie details...</p>
         )}
      </div>
   );
}
