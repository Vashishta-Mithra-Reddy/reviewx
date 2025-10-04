import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from "framer-motion";
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(''); // Clear previous errors
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/auth/login`, {
        email,
        password,
      }, {
        withCredentials: true,
      });

      if (response.status === 200) {
        // Update the auth context with user data
        login(response.data.user);
        toast.success(response.data.message || 'Login successful');
        navigate('/'); 
      } else {
        setError(response.data.message || 'Login failed');
      }
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || 'An error occurred during login.');
      } else {
        console.error('Error during login:', err);
        setError('An error occurred during login.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen min-w-screen flex items-center justify-center font-outfit bg-black/5">
      <motion.div initial={{y:10,opacity: 0,filter:"blur(5px)"}} animate={{y:0,opacity: 1,filter:"blur(0px)"}} exit={{y:10,opacity: 0,filter:"blur(5px)"}} transition={{duration: 0.5,ease:"easeInOut"}} className="px-12 pt-12 pb-6 rounded-xl w-full max-w-md bg-white">
        <h2 className="text-3xl mb-12 text-center">Login to <Link to="/" className="font-semibold">ReviewX</Link></h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        <form onSubmit={handleSubmit} className='flex items-center justify-center flex-col'>
          <div className="mb-4 w-full">
            <label className="block text-gray-500 pl-2 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 text-lg bg-card border-2 border-foreground/20 focus:border-foreground/50 rounded-xl transition-all placeholder:text-muted-foreground duration-500 focus:outline-none"
              placeholder="vashishta@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6 w-full">
            <label className="block text-gray-500 pl-2 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="********"
              className="w-full px-4 py-2 text-lg bg-card border-2 border-foreground/20 focus:border-foreground/50 rounded-xl transition-all placeholder:text-muted-foreground duration-500 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="flex items-center justify-center w-full">
            <button
              type="submit"
              disabled={isSubmitting || !email || !password}
              className="w-full bg-blue-400 hover:bg-blue-500 text-lg text-white font-bold py-2 px-6 rounded-xl cursor-pointer focus:outline-none focus:shadow-outline mt-2 transition-all duration-500"
            >
              {isSubmitting ? (
                <div className="flex items-center justify-center">
                  <svg className="animate-spin h-7 w-7 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </div>
              ) : (
                "Sign In"
              )}
            </button>
          </div>
          <div className="text-center mt-6">
            <Link to="/register">
              <p className="text-md text-gray-500 hover:underline">
                New user? <span className="text-blue-500">Register</span>
              </p>
            </Link>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;