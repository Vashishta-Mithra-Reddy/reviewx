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
  address: string;
  averageRating: string | null;
  userRating?: number | null;
}

interface Rating {
  id: string;
  rating: number;
  storeId: string;
}

const UserDashboard = () => {
  const { user } = useAuth();
  const [stores, setStores] = useState<Store[]>([]);
  const [userRatings, setUserRatings] = useState<Rating[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterName, setFilterName] = useState('');
  const [filterAddress, setFilterAddress] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);
  const [ratingValue, setRatingValue] = useState<number>(5);
  const [ratingLoading, setRatingLoading] = useState(false);

  useEffect(() => {
    fetchStores();
    fetchUserRatings();
  }, [filterName, filterAddress, sortBy, sortOrder]);

  const fetchStores = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/stores`, {
        params: {
          name: filterName,
          address: filterAddress,
          sortBy,
          sortOrder,
        },
        withCredentials: true,
      });
      setStores(response.data);
    } catch (err) {
      console.error('Error fetching stores:', err);
      toast.error('Failed to fetch stores.');
      setError('Failed to load stores data.');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserRatings = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/ratings/user`, {
        withCredentials: true,
      });
      setUserRatings(response.data);
    } catch (err) {
      console.error('Error fetching user ratings:', err);
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
      await axios.put(`${import.meta.env.VITE_BACKEND_URL}/users/me/password`, {
        oldPassword: currentPassword,
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

  const handleSubmitRating = async () => {
    if (!selectedStoreId) return;
    
    setRatingLoading(true);
    try {
      const existingRating = userRatings.find(r => r.storeId === selectedStoreId);
      
      if (existingRating) {
        await axios.put(`${import.meta.env.VITE_BACKEND_URL}/ratings/${existingRating.id}`, {
          rating: ratingValue
        }, {
          withCredentials: true,
        });
        toast.success('Rating updated successfully');
      } else {
        await axios.post(`${import.meta.env.VITE_BACKEND_URL}/ratings`, {
          rating: ratingValue,
          storeId: selectedStoreId
        }, {
          withCredentials: true,
        });
        toast.success('Rating submitted successfully');
      }
      
      fetchUserRatings();
      fetchStores();
      setSelectedStoreId(null);
    } catch (err) {
      console.error('Error submitting rating:', err);
      toast.error('Failed to submit rating');
    } finally {
      setRatingLoading(false);
    }
  };

  const getUserRatingForStore = (storeId: string) => {
    const rating = userRatings.find(r => r.storeId === storeId);
    return rating ? rating.rating : null;
  };

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <div className="wrapperx text-red-500">Error: {error}</div>;
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
        className="px-12 pt-12 pb-6 rounded-xl w-full bg-white border-1 border-gray-300"
      >
        <h3 className="text-3xl mb-12 font-semibold text-center">Store List</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="filterName" className="block text-gray-500 pl-2 text-sm font-bold mb-2">Filter by Name</label>
            <input
              type="text"
              id="filterName"
              className="w-full px-4 py-2 text-lg bg-card border-2 border-foreground/20 focus:border-foreground/50 rounded-xl transition-all placeholder:text-muted-foreground duration-500 focus:outline-none"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="filterAddress" className="block text-gray-500 pl-2 text-sm font-bold mb-2">Filter by Address</label>
            <input
              type="text"
              id="filterAddress"
              className="w-full px-4 py-2 text-lg bg-card border-2 border-foreground/20 focus:border-foreground/50 rounded-xl transition-all placeholder:text-muted-foreground duration-500 focus:outline-none"
              value={filterAddress}
              onChange={(e) => setFilterAddress(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="sortBy" className="block text-gray-500 pl-2 text-sm font-bold mb-2">Sort By</label>
            <select
              id="sortBy"
              className="w-full px-4 py-2 text-lg bg-card border-2 border-foreground/20 focus:border-foreground/50 rounded-xl transition-all placeholder:text-muted-foreground duration-500 focus:outline-none"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name">Name</option>
              <option value="address">Address</option>
              <option value="averageRating">Rating</option>
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
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-background">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Address</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Overall Rating</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Your Rating</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {stores.map((store) => {
                const userRating = getUserRatingForStore(store.id);
                return (
                  <tr key={store.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">{store.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{store.address}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground"><div className="flex items-center">{store.averageRating || 'N/A'}{store.averageRating && <StarRating rating={Number(store.averageRating) || 0} />}</div></td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground"><div className="flex items-center">{userRating || 'Not rated'} {userRating && <StarRating rating={userRating || 0} /> }</div></td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                      <button
                        onClick={() => {
                          setSelectedStoreId(store.id);
                          setRatingValue(userRating || 5);
                        }}
                        className="bg-blue-400 hover:bg-blue-500 text-white font-bold py-1 px-4 rounded-lg cursor-pointer focus:outline-none transition-all duration-500"
                      >
                        {userRating ? 'Update Rating' : 'Rate Store'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
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

      {/* Rating Modal */}
      {selectedStoreId && (
        <div className="fixed inset-0 backdrop-blur-[5px] bg-gray-100/50 bg-opacity-50 flex items-center justify-center z-50">
          <motion.div 
            initial={{scale: 0.9, opacity: 0}} 
            animate={{scale: 1, opacity: 1}} 
            transition={{type: "spring", stiffness: 260, damping: 20}}
            exit={{scale: 0.9, opacity: 0}}
            className="bg-white p-8 rounded-xl w-full max-w-md"
          >
            <h3 className="text-2xl font-semibold mb-6">Rate Store</h3>
            <div className="mb-6">
              <label className="block text-gray-500 pl-2 text-sm font-bold mb-2" htmlFor="rating">
                Rating (1-5)
              </label>
              <div className="flex justify-center space-x-4 my-4">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRatingValue(value)}
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold transition-all duration-300 ${
                      ratingValue === value 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {value}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setSelectedStoreId(null)}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-6 rounded-xl cursor-pointer focus:outline-none transition-all duration-500"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSubmitRating}
                disabled={ratingLoading}
                className="bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded-xl cursor-pointer focus:outline-none transition-all duration-500"
              >
                {ratingLoading ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </div>
                ) : (
                  'Submit'
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;