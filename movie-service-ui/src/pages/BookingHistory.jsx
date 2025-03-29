import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode"; // Fixed import
import { cancelBooking, findBookingById, getCinemaById, getMoviesById } from "../services/service";
import { BsTicketPerforated } from "react-icons/bs";
import QRCode from "qrcode.react"; // Import QRCode component
import Swal from "sweetalert2";
import SkeletonLoader from "../components/SkeletonLoader";

const BookingHistory = () => {
   const [filteredBookings, setFilteredBookings] = useState([]);
   const [email, setEmail] = useState("");
   //    const [userData, setUserData] = useState(null);
   const [loading, setLoading] = useState(false);

   useEffect(() => {
      const fetchUserData = async () => {
         const token = Cookies.get("token");
         if (token) {
            try {
               const userInfo = jwtDecode(token);
               //    setUserData(userInfo?.userData || {});
               const userEmail = userInfo?.userData?.email;

               if (userEmail) {
                  const bookingsData = await findBookingById(userEmail);

                  // Fetch additional movie and cinema details
                  const bookingsWithDetails = await Promise.all(
                     bookingsData.map(async (booking) => {
                        const movieDetails = await getMoviesById(booking.movieId);
                        const cinemaDetails = await getCinemaById(booking.cinemaId);
                        return {
                           ...booking,
                           movieName: movieDetails.title,
                           cinemaName: cinemaDetails.name + "-" + cinemaDetails.address,
                        };
                     })
                  );

                  setFilteredBookings(bookingsWithDetails || []);
               }
            } catch (e) {
               console.error("Error fetching user data or bookings:", e);
            }
         }
      };

      fetchUserData();
   }, []);

   const handleSearch = () => {
      const results = filteredBookings.filter((booking) => booking.email === email);
      setFilteredBookings(results);
   };

   const handleCancel = (id) => {
      Swal.fire({
         title: `Are you sure?`,
         text: "You are going to miss this Adventure",
         icon: "warning",
         showCancelButton: true,
         confirmButtonColor: "#3085d6",
         cancelButtonColor: "#d33",
         confirmButtonText: `Yes, cancel it!`,
      }).then(async (result) => {
         if (result.isConfirmed) {
            setLoading(true);
            try {
               const response = await cancelBooking(id, "true");
               console.log("Updated Cinema Data ::", response);

               Swal.fire({
                  title: `Canceled!`,
                  text: `Booking has been cancelled successfully.`,
                  icon: "success",
                  preConfirm: () => {
                     window.location.reload();
                  },
               });
            } catch (error) {
               console.error("Error updating cinema:", error);
               Swal.fire({
                  title: "Error!",
                  text: "Failed to cancel the booking.",
                  icon: "error",
               });
            } finally {
               setLoading(false);
            }
         }
      });
   };

   return (
      <div className="p-4 bg-white rounded-lg shadow-md">
         <h2 className="text-2xl font-bold mb-4">User Bookings</h2>

         <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
               Enter User Email
            </label>
            <input
               type="email"
               id="email"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            />
            <button
               onClick={handleSearch}
               className="mt-2 bg-blue-500 text-white py-2 px-4 rounded-md shadow-sm hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
               Search Bookings
            </button>
         </div>
         {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               <SkeletonLoader />
               <SkeletonLoader />
               <SkeletonLoader />
            </div>
         ) : filteredBookings.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
               {filteredBookings.map((booking) => (
                  <div
                     key={booking.id}
                     className="relative bg-slate-300 border border-gray-200 rounded-lg shadow-md p-4 hover:cursor-pointer group"
                  >
                     <div className="absolute inset-0 border-1 border-blue-500 rounded-lg pointer-events-none">
                        {booking.bookingStatus !== "Cancelled" ? (
                           <BsTicketPerforated className="absolute inset-0 w-full h-full text-blue-500 opacity-20 rotate-180" />
                        ) : (
                           <BsTicketPerforated className="absolute inset-0 w-full h-full text-orange-500 opacity-20 rotate-180" />
                        )}
                     </div>
                     <div
                        className={`absolute top-0 right-0 rounded-bl-2xl p-3 drop-shadow-lg text-white ${
                           booking.bookingStatus === "Cancelled"
                              ? "bg-red-700"
                              : booking.bookingStatus === "Confirmed"
                              ? "bg-green-700"
                              : "bg-yellow-700"
                        }`}
                     >
                        {booking.bookingStatus || "Pending"}
                     </div>
                     <h3 className="text-lg font-semibold mb-2">Booking ID: {booking.id}</h3>
                     <p>
                        <strong>Movie:</strong> {booking.movieName}
                     </p>
                     <p>
                        <strong>Cinema:</strong> {booking.cinemaName}
                     </p>
                     <p>
                        <strong>Seats:</strong> {booking.seats}
                     </p>
                     <p>
                        <strong>Booking Date:</strong>{" "}
                        {booking.bookingDate
                           ? new Date(booking.bookingDate).toLocaleString()
                           : "Not Booked Yet"}
                     </p>
                     <div className="mt-4 flex justify-center">
                        <QRCode
                           value={`Booking ID: ${booking.id}, Movie: ${booking.movieName}, Cinema: ${booking.cinemaName}, Seats: ${booking.seats}`}
                        />
                     </div>
                     {booking.bookingStatus !== "Cancelled" && (
                        <button
                           className="absolute bottom-2 right-2 rounded-lg p-3 bg-orange-700 hover:cursor-pointer opacity-0 group-hover:opacity-100 hover:bg-orange-800 transition-all duration-700"
                           onClick={() => handleCancel(booking.id)}
                        >
                           Cancel
                        </button>
                     )}
                  </div>
               ))}
            </div>
         ) : (
            <p>No bookings found for this email.</p>
         )}
      </div>
   );
};

export default BookingHistory;
