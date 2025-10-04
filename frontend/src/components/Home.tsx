import React from "react";
import { Link } from "react-router-dom";
import Illustration from "./Illustration";

export default function Home() {
  return (
    <div className="min-h-screen p-6 md:p-0 min-w-screen flex flex-col items-center justify-center font-outfit">
      <div className="p-8 rounded-xl w-full max-w-md text-center bg-background animate-in fade-in-30 duration-1000">
        <h2 className="text-4xl mb-8 md:mb-6">
          Welcome to <span className="font-semibold">ReviewX</span>
        </h2>
        <div className="flex items-center justify-center pt-4 pb-4">
          <Illustration
            width={250}
            height={180}
            ariaLabel="Rating icon"
          />
        </div>
        <div className="flex flex-col sm:flex-row justify-center gap-1 md:gap-8">
          <Link
            to="/login"
            className="bg-blue-400 hover:bg-blue-500 text-lg text-white font-bold py-2 px-8 rounded-xl cursor-pointer focus:outline-none focus:shadow-outline mt-2 transition-all duration-500"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-green-400 hover:bg-green-500 text-lg text-white font-bold py-2 px-8 rounded-xl cursor-pointer focus:outline-none focus:shadow-outline mt-2 transition-all duration-500"
          >
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}