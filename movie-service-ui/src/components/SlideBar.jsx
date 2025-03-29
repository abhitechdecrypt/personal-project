// src/Sidebar.js
import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const SlideBar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`fixed top-0 left-0 h-full bg-gray-800 text-white transition-transform duration-300 ${isOpen ? 'w-64' : 'w-20'} transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      <button
        onClick={toggleSidebar}
        className="absolute top-4 right-[-2rem] text-white bg-gray-700 rounded-full p-2 focus:outline-none"
      >
        {isOpen ? '❮' : '❯'}
      </button>
      <div className="p-4">
        <h2 className="text-xl font-bold mb-6">MovieApp</h2>
        <nav>
          <ul>
            <li className="mb-4">
              <Link to="/" className="flex items-center text-gray-300 hover:text-white">
                <span className="mr-3">🏠</span>
                {isOpen && <span>Home</span>}
              </Link>
            </li>
            <li className="mb-4">
              <Link to="/about" className="flex items-center text-gray-300 hover:text-white">
                <span className="mr-3">ℹ️</span>
                {isOpen && <span>About</span>}
              </Link>
            </li>
            <li className="mb-4">
              <Link to="/contact" className="flex items-center text-gray-300 hover:text-white">
                <span className="mr-3">📞</span>
                {isOpen && <span>Contact</span>}
              </Link>
            </li>
            <li className="mb-4">
              <Link to="/movies" className="flex items-center text-gray-300 hover:text-white">
                <span className="mr-3">🎬</span>
                {isOpen && <span>Movies</span>}
              </Link>
            </li>
            {/* Add more links as needed */}
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default SlideBar;
