"use client";

import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import React, { useState } from "react";

export default function Header({ role }: { role: "admin" | "user" | "store_owner" | null }) {
  const { logout } = useAuth();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const activeTab = queryParams.get('tab');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="w-full backdrop-blur-3xl sticky shadow-xs top-0 z-50 font-outfit">
      <div className="max-w-7xl mx-auto md:px-0 px-8 py-5 flex items-center justify-between">
        {/* Logo/Name Section */}
        <Link to={"/"} className="text-3xl font-semibold hover:text-primary transition duration-300 ease-in-out flex items-center justify-center">
          ReviewX
        </Link>

        {/* Role-specific Links */}
        <div className="md:flex hidden items-center space-x-4">
          {role === "admin" && (
            <div className="flex space-x-4 border-gray-200 overflow-x-auto no-scrollbar">
              {[
                { key: 'overview', label: 'Dashboard', path: '/' },
                { key: 'addUser', label: 'Add User', path: '/?tab=addUser' },
                { key: 'addStore', label: 'Add Store', path: '/?tab=addStore' },
                { key: 'userList', label: 'User List', path: '/?tab=userList' },
                { key: 'storeList', label: 'Store List', path: '/?tab=storeList' },
              ].map((item) => (
                <Link
                  key={item.key}
                  to={item.path}
                  className={`relative px-6 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 
                    ${
                      (item.key === 'overview' && location.pathname === '/' && !activeTab) || 
                      (activeTab === item.key)
                        ? 'text-primary bg-gray-200'
                        : 'text-gray-600 hover:text-primary hover:bg-gray-100'
                    }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}

          {role === "user" && (
            <div className="flex space-x-4 border-gray-200 overflow-x-auto no-scrollbar">
              <p className="text-lg">User Dashboard</p>
            </div>
          )}
          
          {role === "store_owner" && (
            <div className="flex space-x-4 border-gray-200 overflow-x-auto no-scrollbar">
              <p className="text-lg">Store Dashboard</p>
            </div>
          )}
        </div>

        {/* Desktop Logout Button With Theme Switcher */}
        <div className="hidden md:flex space-x-4 items-center">
          <button
            onClick={logout}
            className="bg-red-400 hover:bg-red-300 text-white font-bold py-2.5 h-fit px-6 rounded-xl focus:outline-none transition duration-200 cursor-pointer"
          >
            Logout
          </button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button onClick={toggleMobileMenu} className="text-gray-600 hover:text-primary focus:outline-none">
            {isMobileMenuOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu Content */}
      {isMobileMenuOpen && (
        <div className="md:hidden px-8 pb-5 flex flex-col space-y-4">
          {role === "admin" && (
            <div className="flex flex-col space-y-2">
              {[
                { key: 'overview', label: 'Dashboard', path: '/' },
                { key: 'addUser', label: 'Add User', path: '/?tab=addUser' },
                { key: 'addStore', label: 'Add Store', path: '/?tab=addStore' },
                { key: 'userList', label: 'User List', path: '/?tab=userList' },
                { key: 'storeList', label: 'Store List', path: '/?tab=storeList' },
              ].map((item) => (
                <Link
                  key={item.key}
                  to={item.path}
                  onClick={toggleMobileMenu} // Close menu on link click
                  className={`relative px-6 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 
                    ${
                      (item.key === 'overview' && location.pathname === '/' && !activeTab) || 
                      (activeTab === item.key)
                        ? 'text-primary bg-gray-200'
                        : 'text-gray-600 hover:text-primary hover:bg-gray-100'
                    }`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}

          {role === "user" && (
            <div className="flex flex-col space-y-2">
              <p className="text-lg">User Dashboard</p>
            </div>
          )}
          
          {role === "store_owner" && (
            <div className="flex flex-col space-y-2">
              <p className="text-lg">Store Dashboard</p>
            </div>
          )}

          <button
            onClick={() => { logout(); toggleMobileMenu(); }} // Close menu on logout
            className="bg-red-400 hover:bg-red-300 text-white font-bold py-2.5 h-fit px-6 rounded-xl focus:outline-none transition duration-200 cursor-pointer"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
}