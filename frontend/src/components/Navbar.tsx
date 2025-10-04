import React from 'react';
import { Link } from 'react-router-dom';

const Navbar: React.FC = () => {
  return (
    <nav className="flex justify-around p-4 bg-gray-800 text-white">
      <Link to="/" className="text-white no-underline">Home</Link>
      <Link to="/register" className="text-white no-underline">Register</Link>
      <Link to="/login" className="text-white no-underline">Login</Link>
    </nav>
  );
};

export default Navbar;