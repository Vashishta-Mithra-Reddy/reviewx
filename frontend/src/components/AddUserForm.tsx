import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion } from "framer-motion";

const AddUserForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');
  const [role, setRole] = useState('user'); // Default role
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/users`, {
        name,
        email,
        password,
        address,
        role,
      }, {
        withCredentials: true,
      });

      if (response.status === 201) {
        toast.success(response.data.message || 'User added successfully');
        setName('');
        setEmail('');
        setPassword('');
        setAddress('');
        setRole('user');
      } else {
        toast.error(response.data.message || 'Failed to add user');
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'An error occurred while adding user.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div initial={{y:10,opacity: 0,filter:"blur(5px)"}} animate={{y:0,opacity: 1,filter:"blur(0px)"}} exit={{y:10,opacity: 0,filter:"blur(5px)"}} transition={{duration: 0.5,ease:"easeInOut"}} className="px-12 pt-12 pb-6 rounded-xl w-full max-w-xl bg-white border-1 border-gray-300">
      <h3 className="text-3xl mb-12 text-center font-semibold">Add New User</h3>
      <form onSubmit={handleSubmit} className="flex items-center justify-center flex-col">
        <div className="mb-4 w-full">
          <label htmlFor="name" className="block text-gray-500 pl-2 text-sm font-bold mb-2">Name</label>
          <input
            type="text"
            id="name"
            placeholder="Enter user name"
            className="w-full px-4 py-2 text-lg bg-card border-2 border-foreground/20 focus:border-foreground/50 rounded-xl transition-all placeholder:text-muted-foreground duration-500 focus:outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4 w-full">
          <label htmlFor="email" className="block text-gray-500 pl-2 text-sm font-bold mb-2">Email</label>
          <input
            type="email"
            id="email"
            placeholder="Enter user email"
            className="w-full px-4 py-2 text-lg bg-card border-2 border-foreground/20 focus:border-foreground/50 rounded-xl transition-all placeholder:text-muted-foreground duration-500 focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-6 w-full">
          <label htmlFor="password" className="block text-gray-500 pl-2 text-sm font-bold mb-2">Password</label>
          <input
            type="password"
            id="password"
            placeholder="Enter user password"
            className="w-full px-4 py-2 text-lg bg-card border-2 border-foreground/20 focus:border-foreground/50 rounded-xl transition-all placeholder:text-muted-foreground duration-500 focus:outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="mb-6 w-full">
          <label htmlFor="address" className="block text-gray-500 pl-2 text-sm font-bold mb-2">Address</label>
          <input
            type="text"
            id="address"
            placeholder="Enter user address"
            className="w-full px-4 py-2 text-lg bg-card border-2 border-foreground/20 focus:border-foreground/50 rounded-xl transition-all placeholder:text-muted-foreground duration-500 focus:outline-none"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>
        <div className="mb-6 w-full">
          <label htmlFor="role" className="block text-gray-500 pl-2 text-sm font-bold mb-2">Role</label>
          <select
            id="role"
            className="w-full px-4 py-2 text-lg bg-card border-2 border-foreground/20 focus:border-foreground/50 rounded-xl transition-all placeholder:text-muted-foreground duration-500 focus:outline-none"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="user">Normal User</option>
            <option value="admin">Admin</option>
            <option value="store_owner">Store Owner</option>
          </select>
        </div>
        <div className="flex items-center justify-center w-full">
          <button
            type="submit"
            className="w-full bg-blue-400 hover:bg-blue-500 text-lg text-white font-bold py-2 px-6 rounded-xl cursor-pointer focus:outline-none focus:shadow-outline mt-2 transition-all duration-500"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin h-7 w-7 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : (
              'Add User'
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default AddUserForm;