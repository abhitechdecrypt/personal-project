// src/Slider.js
import React, { useEffect, useState } from 'react';
import avatar from '../assets/images/avatar2.jpg';
import Interstellar from '../assets/images/Interstellar.jpg';
import nowayhome from '../assets/images/nowayhome.jpg';

const slides = [
  {
    id: 1,
    title: 'Avatar: The Way of Water',
    description: 'The sequel to the 2009 film Avatar.',
    imageUrl: avatar, // Replace with actual URL
  },
  {
    id: 2,
    title: 'Spider-Man: No Way Home',
    description: 'Spider-Man comes across his biggest challenge yet.',
    imageUrl: nowayhome, // Replace with actual URL
  },
  {
    id: 3,
    title: 'Interstellar',
    description: 'A team of explorers travel through a wormhole in space.',
    imageUrl: Interstellar, // Replace with actual URL
  },
  // Add more slides as needed
];
const Slider = () => {
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
      const slideInterval = setInterval(() => {
        setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
      }, 5000);
  
      return () => clearInterval(slideInterval); 
    }, []);
  
    return (
      <div className="relative w-full overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide) => (
            <div key={slide.id} className="flex-shrink-0 w-full">
              <img
                src={slide.imageUrl}
                alt={slide.title}
                className="w-full h-80 object-cover"
              />
              <div className="p-4 bg-black text-white">
                <h2 className="text-2xl font-bold">{slide.title}</h2>
                <p>{slide.description}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {slides.map((_, index) => (
          <span
            key={index}
            className={`block w-2 h-2 rounded-full transition-all duration-700 ${
              index === currentSlide ? 'bg-white w-6' : 'bg-gray-500'
            }`}
          />
        ))}
      </div>
      </div>
    );
  };
  
  export default Slider;