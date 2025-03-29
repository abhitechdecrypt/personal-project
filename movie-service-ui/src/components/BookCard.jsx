// src/components/BookCard.js
import React from 'react';

const BookCard = ({ movie, isHovered }) => {
  return (
    <div
      className={`relative hover:w-80 w-64 h-96 bg-gray-800 rounded-lg overflow-hidden transition-all duration-300`}
    >
      {/* Movie Poster */}
      <img
        src={movie.posterUrl}
        alt={movie.title}
        className="w-full h-96 object-cover"
      />
      
      {/* Movie Details Overlay */}
      <div className="absolute inset-0 bg-gray-900 bg-opacity-75 text-white flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
        <h3 className="text-lg font-bold">{movie.title}</h3>
        <p className="mt-2 text-center">{movie.description}</p>
        <p className="mt-2">Genre: {movie.genre}</p>
      </div>
    </div>
  );
};

export default BookCard;
