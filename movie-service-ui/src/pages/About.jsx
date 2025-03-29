import React from "react";
import BookCard from "../components/BookCard";
import avatar from "../assets/images/avtar.jpeg";
import "../index.css";
import axios from "axios";

export default function About() {
   const movie = {
      title: "Inception",
      poster: avatar,
      description: "A mind-bending thriller by Christopher Nolan.",
      releaseDate: "2010-07-16",
      rating: "8.8/10",
   };
   const registerUser = () => {
      axios
         .post("http://localhost:8083/api/v1/movies/register-user", {
            userName: "Abhishek Kumar",
            password: "Abhishek@123",
            email: "abhishek.kumar12@gmail.com",
            phoneNumber: "7979018812",
            address: "123 Main St, Anytown, USA",
            userRole: "USER",
            accountStatus: "ACTIVE",
            profilePicture: "http://example.com/profile.jpg",
         }, )
         .then((re) => {
            console.log(re);
         })
         .catch((er) => {
            console.log(er);
         });
   };

   return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100 cursor-pointer">
         <BookCard movie={movie} />
         <button onClick={registerUser}>Register User</button>
      </div>
   );
}
