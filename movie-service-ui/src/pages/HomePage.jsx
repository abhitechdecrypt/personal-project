// src/HomePage.js
import React, { useEffect, useRef, useState } from "react";
import avatar from "../assets/images/avtar.jpeg";
import nowayHome from "../assets/images/spider-man.jpeg";
import Interstellar from "../assets/images/Interstellar.jpeg";
import BookCard from "../components/BookCard";
import axios from "axios";
import { BASE_URL, SUB_URL_MOVIES } from "../services/API_CONSTANT";
import { useNavigate } from "react-router-dom";
import SkeletonLoader from "../components/SkeletonLoader";

// Hardcoded data for featured movies and other movies
const featuredMovies = [
   {
      id: 1,
      title: "Avatar: The Way of Water",
      description: "The sequel to the 2009 film Avatar.",
      genre: "Sci-Fi",
      posterUrl: avatar,
   },
   {
      id: 2,
      title: "Spider-Man: No Way Home",
      description: "Spider-Man comes across his biggest challenge yet.",
      genre: "Action",
      posterUrl: nowayHome,
   },
   {
      id: 3,
      title: "Interstellar",
      description: "A team of explorers travel through a wormhole in space.",
      genre: "Sci-fication",
      posterUrl: Interstellar,
   },
   {
      id: 4,
      title: "Avatar: The Way of Water",
      description: "The sequel to the 2009 film Avatar.",
      genre: "Sci-Fi",
      posterUrl: avatar,
   },
   {
      id: 5,
      title: "Spider-Man: No Way Home",
      description: "Spider-Man comes across his biggest challenge yet.",
      genre: "Action",
      posterUrl: nowayHome,
   },
   {
      id: 6,
      title: "Interstellar",
      description: "A team of explorers travel through a wormhole in space.",
      genre: "Sci-fication",
      posterUrl: Interstellar,
   },
   {
      id: 7,
      title: "Avatar: The Way of Water",
      description: "The sequel to the 2009 film Avatar.",
      genre: "Sci-Fi",
      posterUrl: avatar,
   },
   {
      id: 8,
      title: "Spider-Man: No Way Home",
      description: "Spider-Man comes across his biggest challenge yet.",
      genre: "Action",
      posterUrl: nowayHome,
   },
   {
      id: 9,
      title: "Interstellar",
      description: "A team of explorers travel through a wormhole in space.",
      genre: "Sci-fication",
      posterUrl: Interstellar,
   },
];

const HomePage = () => {
   const [flippedCardIndex, setFlippedCardIndex] = useState(null);
   const [showLeftArrow, setShowLeftArrow] = useState(false);
   const [showRightArrow, setShowRightArrow] = useState(true);
   const [currentMoviesData, setCurrentMoviesData] = useState([]);
   const [loading, setLoading] = useState(true);
   const carouselRef = useRef(null);
   const navigate = useNavigate();

   const handleCardClick = (index) => {
      setFlippedCardIndex(index === flippedCardIndex ? null : index);
   };

   const getScrollDistance = () => {
      let distance = 600;

      if (window.innerWidth < 768) {
         distance = 250;
      }

      return distance;
   };
   const scrollLeft = () => {
      carouselRef.current.scrollBy({ left: -getScrollDistance(), behavior: "smooth" });
   };

   const scrollRight = () => {
      carouselRef.current.scrollBy({ left: getScrollDistance(), behavior: "smooth" });
   };

   const checkScrollPosition = () => {
      const { scrollLeft, scrollWidth, clientWidth } = carouselRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth);
   };

   useEffect(() => {
      checkScrollPosition();
      window.addEventListener("resize", checkScrollPosition);
      return () => window.removeEventListener("resize", checkScrollPosition);
   }, []);

   useEffect(() => {
      axios
         .get(BASE_URL + SUB_URL_MOVIES + "movies")
         .then((res) => {
            console.log("Data : MOVIES:", res?.data);
            setCurrentMoviesData(res?.data); // Assuming res.data.data is the array of movies
            // setLoading(false);
         })
         .catch((err) => {
            console.error("Error fetching movies: ", err);
            // setLoading(false);
         });
   }, []);

   const handleBooking = (id) => {
      navigate(`/book-movies/${id}`);
   };

   useEffect(() => {
      // Simulate a data fetch
      setTimeout(() => {
         // Fetch your data here and set it to currentMoviesData
         setLoading(false);
      }, 3000); // Example delay
   }, []);

   return (
      <div className="p-6 bg-gray-100 min-h-screen">
         {/* Featured Movies Carousel */}
         <section className="mb-12">
            <h2 className="text-3xl font-bold mb-4 text-gray-800">Arriving Soon</h2>
            <div className="relative">
               {showLeftArrow && (
                  <button
                     onClick={scrollLeft}
                     className="absolute left-0 top-1/2 transform -translate-y-1/2 bg-slate-400 text-white p-2 rounded-e-full z-10 shadow-lg shadow-slate-800"
                  >
                     &larr;
                  </button>
               )}
               {showRightArrow && (
                  <button
                     onClick={scrollRight}
                     className="absolute right-0 top-1/2 transform -translate-y-1/2 bg-slate-400 text-white p-2 rounded-s-full z-10"
                  >
                     &rarr;
                  </button>
               )}
               <div
                  ref={carouselRef}
                  className="flex overflow-x-hidden no-scrollbar space-x-4 pb-4"
                  onScroll={checkScrollPosition}
               >
                  {featuredMovies.map((movie, index) => (
                     <div
                        key={movie.id}
                        className="flex-none w-64 bg-white rounded-lg transition-transform duration-700 hover:w-80 cursor-pointer"
                        onClick={() => handleCardClick(index)}
                     >
                        <BookCard movie={movie} />
                     </div>
                  ))}
               </div>
            </div>
         </section>

         {/* Movies Grid */}
         {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               <SkeletonLoader />
               <SkeletonLoader />
               <SkeletonLoader />
            </div>
         ) : (
            <section id="movie-section">
               <h2 className="text-3xl font-bold mb-4 text-gray-800">Currently in Cinemas</h2>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {currentMoviesData.length > 0 ? (
                     currentMoviesData.map((movie) => (
                        <div
                           key={movie.id}
                           className="relative bg-white p-4 rounded-lg shadow-lg hover:bg-slate-200 transition-all duration-700 hover:scale-95 cursor-pointer group"
                        >
                           <img
                              src={movie.image}
                              alt={movie.title}
                              className="w-full h-64 object-cover rounded-md"
                           />
                           <h2 className="text-xl font-semibold mt-4">{movie.title}</h2>
                           <p className="text-gray-600 mt-2">{movie.director}</p>
                           <p className="text-gray-600 mt-2">Genre: {movie.genre}</p>
                           <p className="text-gray-600 mt-2">Rating: {movie.ratings}</p>
                           <p className="text-gray-600 mt-2">Length: {movie.length} mins</p>
                           <p className="text-gray-600 mt-2">Release Date: {movie.releasedDate}</p>

                           {/* Cinema List Dropdown */}
                           <div className="absolute top-0 right-0 w-64 bg-black bg-opacity-70 text-white flex flex-col p-4 transform translate-y-full opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 z-10 rounded-tr-lg">
                              <h3 className="text-lg font-semibold mb-2">Playing at:</h3>
                              <ul className="list-disc pl-5">
                                 {movie.cinemas.map((cinema) => (
                                    <li key={cinema.id}>{cinema.name}</li>
                                 ))}
                              </ul>
                           </div>

                           {/* Watch Now Button */}
                           <button
                              className="absolute bottom-2 right-2 bg-slate-400 text-white p-2 rounded-full shadow-2xl shadow-slate-800 opacity-0 group-hover:opacity-100 transition-opacity duration-700 hover:bg-zinc-700"
                              onClick={() => handleBooking(movie.id)}
                           >
                              Watch Now
                           </button>
                        </div>
                     ))
                  ) : (
                     <h4 className="text-center text-xl font-semibold text-gray-700">
                        No Movies Playing in Cinema
                     </h4>
                  )}
               </div>
            </section>
         )}
      </div>
   );
};

export default HomePage;
