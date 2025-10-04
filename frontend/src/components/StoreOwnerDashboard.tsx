import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion } from "framer-motion";
import Spinner from './Spinner';
import { useAuth } from '../context/AuthContext';
import StarRating from './StarRating';

interface Store {
  id: string;
  name: string;
  email: string;
  address: string;
  averageRating: string | null;
}

interface Rating {
  id: string;
  rating: number;
  userId: string;
  User: {
    name: string;
    email: string;
  };
}

const StoreOwnerDashboard = () => {
  const { user } = useAuth();
  const [store, setStore] = useState<Store | null>(null);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [sortBy, setSortBy] = useState('userName');
  const [sortOrder, setSortOrder] = useState('asc');

  useEffect(() => {
    fetchStoreData();
  }, []);

  const fetchStoreData = async () => {
    try {
      // Fetch the store owned by the current user
      const storeResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/stores/owner`, {
        withCredentials: true,
      });
      
      if (storeResponse.data) {
        setStore(storeResponse.data);
        
        // Fetch ratings for this store
        const ratingsResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/ratings/${storeResponse.data.id}`, {
          withCredentials: true,
        });
        
        setRatings(ratingsResponse.data);
      }
    } catch (err) {
      console.error('Error fetching store data:', err);
      toast.error('Failed to fetch store data.');
      setError('Failed to load store data.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    
    setPasswordLoading(true);
    try {
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/users/password`, {
        currentPassword,
        newPassword
      }, {
        withCredentials: true,
      });
      
      toast.success('Password updated successfully');
      setShowPasswordModal(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error('Error updating password:', err);
      toast.error('Failed to update password');
    } finally {
      setPasswordLoading(false);
    }
  };

  const sortedRatings = [...ratings].sort((a, b) => {
    let comparison = 0;
    
    if (sortBy === 'userName') {
      comparison = a.User.name.localeCompare(b.User.name);
    } else if (sortBy === 'userEmail') {
      comparison = a.User.email.localeCompare(b.User.email);
    } else if (sortBy === 'rating') {
      comparison = a.rating - b.rating;
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <div className="wrapperx text-red-500">Error: {error}</div>;
  }

  if (!store) {
    return (
      <div className="wrapperx">
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">No store found</h2>
          <p className="text-gray-600">You don't have a store assigned to your account.</p>
          <p className="text-gray-600">Please contact an administrator to assign a store to you.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="wrapperx">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h2 className="text-3xl font-semibold mb-4 md:mb-0">Welcome, {user?.name}</h2>
        <button 
          onClick={() => setShowPasswordModal(true)}
          className="bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded-xl cursor-pointer focus:outline-none transition-all duration-500"
        >
          Update Password
        </button>
      </div>

      <motion.div 
        initial={{y:10, opacity: 0, filter:"blur(5px)"}} 
        animate={{y:0, opacity: 1, filter:"blur(0px)"}} 
        exit={{y:10, opacity: 0, filter:"blur(5px)"}} 
        transition={{duration: 0.5, ease:"easeInOut"}} 
        className="px-12 pt-12 pb-6 rounded-xl w-full bg-white border-1 border-gray-300 mb-8"
      >
        <h3 className="text-2xl mb-8 font-semibold text-start">Store Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <p className="text-gray-500 text-sm font-bold mb-1">Store Name</p>
            <p className="text-xl">{store.name}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm font-bold mb-1">Email</p>
            <p className="text-xl">{store.email}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm font-bold mb-1">Address</p>
            <p className="text-xl">{store.address}</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm font-bold mb-1">Average Rating</p>
            <div className="flex items-center">
              <p className="text-2xl font-bold text-primary">{store.averageRating || 'N/A'}</p>
              {store.averageRating && <StarRating rating={parseFloat(store.averageRating)} />}
            </div>
          </div>
        </div>
      </motion.div>

      <motion.div 
        initial={{y:10, opacity: 0, filter:"blur(5px)"}} 
        animate={{y:0, opacity: 1, filter:"blur(0px)"}} 
        exit={{y:10, opacity: 0, filter:"blur(5px)"}} 
        transition={{duration: 0.5, ease:"easeInOut", delay: 0.2}} 
        className="px-12 pt-12 pb-6 rounded-xl w-full bg-white border-1 border-gray-300"
      >
        <h3 className="text-2xl mb-8 font-semibold text-start">Customer Ratings</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label htmlFor="sortBy" className="block text-gray-500 pl-2 text-sm font-bold mb-2">Sort By</label>
            <select
              id="sortBy"
              className="w-full px-4 py-2 text-lg bg-card border-2 border-foreground/20 focus:border-foreground/50 rounded-xl transition-all placeholder:text-muted-foreground duration-500 focus:outline-none"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="userName">Customer Name</option>
              <option value="userEmail">Email</option>
              <option value="rating">Rating</option>
            </select>
          </div>
          <div>
            <label htmlFor="sortOrder" className="block text-gray-500 pl-2 text-sm font-bold mb-2">Sort Order</label>
            <select
              id="sortOrder"
              className="w-full px-4 py-2 text-lg bg-card border-2 border-foreground/20 focus:border-foreground/50 rounded-xl transition-all placeholder:text-muted-foreground duration-500 focus:outline-none"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>
        
        {sortedRatings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-border">
              <thead className="bg-background">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Customer Name</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Email</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Rating</th>
                </tr>
              </thead>
              <tbody className="bg-card divide-y divide-border">
                {sortedRatings.map((rating) => (
                  <tr key={rating.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">{rating.User.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{rating.User.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                      <div className="flex items-center">
                        <span className="text-lg font-semibold">{rating.rating}</span>
                        <StarRating rating={rating.rating} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No ratings yet for your store.</p>
          </div>
        )}
      </motion.div>

      {/* Password Update Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-gray-100 bg-opacity-50 flex items-center justify-center z-50">
          <motion.div 
            initial={{scale: 0.9, opacity: 0}} 
            animate={{scale: 1, opacity: 1}} 
            className="bg-white p-8 rounded-xl w-full max-w-md"
          >
            <h3 className="text-2xl font-semibold mb-6">Update Password</h3>
            <form onSubmit={handleUpdatePassword}>
              <div className="mb-4">
                <label className="block text-gray-500 pl-2 text-sm font-bold mb-2" htmlFor="currentPassword">
                  Current Password
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  className="w-full px-4 py-2 text-lg bg-card border-2 border-foreground/20 focus:border-foreground/50 rounded-xl transition-all placeholder:text-muted-foreground duration-500 focus:outline-none"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-500 pl-2 text-sm font-bold mb-2" htmlFor="newPassword">
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  className="w-full px-4 py-2 text-lg bg-card border-2 border-foreground/20 focus:border-foreground/50 rounded-xl transition-all placeholder:text-muted-foreground duration-500 focus:outline-none"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-500 pl-2 text-sm font-bold mb-2" htmlFor="confirmPassword">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  className="w-full px-4 py-2 text-lg bg-card border-2 border-foreground/20 focus:border-foreground/50 rounded-xl transition-all placeholder:text-muted-foreground duration-500 focus:outline-none"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded-xl cursor-pointer focus:outline-none transition-all duration-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded-xl cursor-pointer focus:outline-none transition-all duration-500"
                >
                  {passwordLoading ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    </div>
                  ) : (
                    'Update'
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default StoreOwnerDashboard;