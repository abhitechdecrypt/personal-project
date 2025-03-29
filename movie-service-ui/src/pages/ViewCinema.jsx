import React, { useEffect, useState } from "react";
import { blockUnblockCinema, getCinemaList } from "../services/service";
import Swal from "sweetalert2";

const ViewCinema = () => {
   const [cinemas, setCinemas] = useState([]);
   const [error, setError] = useState(null);
   const [loading, setLoading] = useState(false);

   // Fetch cinema data from backend
   useEffect(() => {
      const getCinemaData = async () => {
         setLoading(true);
         try {
            const response = await getCinemaList();
            console.log("Cinema Data ::", response);
            if (response && Array.isArray(response)) {
               setCinemas(response); // Ensure cinemas is always an array
            } else {
               console.error("Expected array but got:", response);
               setCinemas([]); // Reset to empty array if response is not an array
            }
         } catch (error) {
            setError("Failed to load cinemas");
            console.error("Error fetching cinemas:", error);
         } finally {
            setLoading(false);
         }
      };

      getCinemaData();
   }, []);

   const handleUnblockAndBlockCinema = async (id, blocked) => {
      const action = blocked ? "Block" : "Unblock";
      const confirmText = blocked
         ? "Are you sure you want to block this cinema?"
         : "Are you sure you want to unblock this cinema?";

      Swal.fire({
         title: `Are you sure?`,
         text: confirmText,
         icon: "warning",
         showCancelButton: true,
         confirmButtonColor: "#3085d6",
         cancelButtonColor: "#d33",
         confirmButtonText: `Yes, ${action} it!`
      }).then(async (result) => {
         if (result.isConfirmed) {
            setLoading(true);
            try {
               const response = await blockUnblockCinema(id);
               console.log("Updated Cinema Data ::", response);
               if (response && Array.isArray(response)) {
                  setCinemas(response); // Ensure cinemas is always an array
               } else {
                  console.error("Expected array but got:", response);
                 // setCinemas([]); // Reset to empty array if response is not an array
               }
               Swal.fire({
                  title: `${action}ed!`,
                  text: `The cinema has been ${action.toLowerCase()}ed.`,
                  icon: "success",
                  preConfirm:()=>{
                     window.location.reload();
                  }
               });
            } catch (error) {
               setError("Failed to update cinema status");
               console.error("Error updating cinema:", error);
               Swal.fire({
                  title: "Error!",
                  text: "Failed to update cinema status.",
                  icon: "error"
               });
            } finally {
               setLoading(false);
            }
         }
      });
   };

   return (
      <div className="max-w-8xl mx-auto p-4">
         <h2 className="text-2xl font-bold mb-6">Cinemas</h2>

         {loading && <p className="text-blue-500">Loading...</p>}
         {error && <p className="text-red-500">{error}</p>}

         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {cinemas.map((cinema) => (
               <div
                  key={cinema.id}
                  className="bg-gray-100 p-4 rounded-lg shadow-lg relative hover:bg-slate-400 transition-all duration-1000 hover:scale-x-95 cursor-pointer"
               >
                  <h3 className="text-xl font-semibold mb-2">{cinema.name}</h3>
                  <p className="text-gray-700 mb-2">
                     <strong>Address:</strong> {cinema.address}
                  </p>
                  <p className="text-gray-700 mb-2">
                     <strong>Total Screens:</strong> {cinema.totalScreens}
                  </p>
                  <p className="text-gray-700 mb-2">
                     <strong>Total Seats:</strong> {cinema.totalSeats}
                  </p>
                  <p className="text-gray-700 mb-2">
                     <strong>Facilities:</strong> {cinema.facilities}
                  </p>
                  <p
                     className={`text-gray-700 font-semibold ${
                        cinema.blocked ? "text-red-500" : "text-green-500"
                     }`}
                  >
                     {cinema.blocked ? "Blocked" : "Available"}
                  </p>
                  <button
                     className={`absolute p-3 rounded-full right-2 bottom-3 ${
                        cinema.blocked ? "bg-green-600" : "bg-red-600"
                     }`}
                     onClick={() => handleUnblockAndBlockCinema(cinema.id)}
                  >
                     {cinema.blocked ? "Unblock Cinema" : "Block Cinema"}
                  </button>
               </div>
            ))}
         </div>
      </div>
   );
};

export default ViewCinema;
