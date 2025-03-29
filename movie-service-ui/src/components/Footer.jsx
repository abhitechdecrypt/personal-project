// src/components/Footer.js
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap justify-between">
          <div className="w-full md:w-1/4 mb-4 md:mb-0">
            <h3 className="text-lg font-bold mb-2">About Us</h3>
            <p className="text-sm">
              We are dedicated to bringing you the latest movies and cinema news. Follow us to stay updated!
            </p>
          </div>
          <div className="w-full md:w-1/4 mb-4 md:mb-0">
            <h3 className="text-lg font-bold mb-2">Quick Links</h3>
            <ul className="text-sm">
              <li><a href="#home" className="hover:underline">Home</a></li>
              <li><a href="#movies" className="hover:underline">Movies</a></li>
              <li><a href="#contact" className="hover:underline">Contact</a></li>
              <li><a href="#about" className="hover:underline">About</a></li>
            </ul>
          </div>
          <div className="w-full md:w-1/4 mb-4 md:mb-0">
            <h3 className="text-lg font-bold mb-2">Contact Us</h3>
            <p className="text-sm">Email: info@emovie.com</p>
            <p className="text-sm">Phone: +1 (123) 456-7890</p>
          </div>
          <div className="w-full md:w-1/4 mb-4 md:mb-0">
            <h3 className="text-lg font-bold mb-2">Follow Us</h3>
            <div className="flex space-x-4">
              {/* <a href="#" className="text-gray-400 hover:text-white"><i className="fab fa-facebook-f"></i></a>
              <a href="#" className="text-gray-400 hover:text-white"><i className="fab fa-twitter"></i></a>
              <a href="#" className="text-gray-400 hover:text-white"><i className="fab fa-instagram"></i></a>
              <a href="#" className="text-gray-400 hover:text-white"><i className="fab fa-youtube"></i></a> */}
            </div>
          </div>
        </div>
      </div>
      <div className="text-center text-sm mt-4">
        &copy; {new Date().getFullYear()} e-Movie. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
