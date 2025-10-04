import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { motion } from "framer-motion";
import Spinner from './Spinner';

interface StoreOwner {
  id: string;
  name: string;
  email: string;
}

const AddStoreForm = () => {
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [owner_id, setOwnerId] = useState('');
  const [loading, setLoading] = useState(false);
  const [storeOwners, setStoreOwners] = useState<StoreOwner[]>([]);
  const [loadingOwners, setLoadingOwners] = useState(false);

  useEffect(() => {
    fetchStoreOwners();
  }, []);

  const fetchStoreOwners = async () => {
    setLoadingOwners(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users/store-owners`, {
        withCredentials: true,
      });
      setStoreOwners(response.data);
    } catch (err) {
      console.error('Error fetching store owners:', err);
      toast.error('Failed to fetch store owners.');
    } finally {
      setLoadingOwners(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!owner_id) {
      toast.error('Please select a store owner');
      return;
    }
    
    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/stores`, {
        name, address, phone, email, owner_id
      }, {
        withCredentials: true,
      });
      toast.success('Store added successfully!');
      setName('');
      setAddress('');
      setPhone('');
      setEmail('');
      setOwnerId('');
    } catch (err) {
      console.error('Error adding store:', err);
      toast.error('Failed to add store.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div initial={{y:10,opacity: 0,filter:"blur(5px)"}} animate={{y:0,opacity: 1,filter:"blur(0px)"}} exit={{y:10,opacity: 0,filter:"blur(5px)"}} transition={{duration: 0.5,ease:"easeInOut"}} className="px-12 pt-12 pb-6 rounded-xl w-full max-w-xl bg-white border-1 border-gray-300">
      <h2 className="font-semibold text-3xl mb-12 text-center">Add New Store</h2>
      <form onSubmit={handleSubmit} className="flex items-center justify-center flex-col">
        <div className="mb-4 w-full">
          <label htmlFor="storeName" className="block text-gray-500 pl-2 text-sm font-bold mb-2">Store Name</label>
          <input
            type="text"
            id="storeName"
            placeholder="Enter store name"
            className="w-full px-4 py-2 text-lg bg-card border-2 border-foreground/20 focus:border-foreground/50 rounded-xl transition-all placeholder:text-muted-foreground duration-500 focus:outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="mb-4 w-full">
          <label htmlFor="storeAddress" className="block text-gray-500 pl-2 text-sm font-bold mb-2">Address</label>
          <input
            type="text"
            id="storeAddress"
            placeholder="Enter store address"
            className="w-full px-4 py-2 text-lg bg-card border-2 border-foreground/20 focus:border-foreground/50 rounded-xl transition-all placeholder:text-muted-foreground duration-500 focus:outline-none"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>
        <div className="mb-4 w-full">
          <label htmlFor="storePhone" className="block text-gray-500 pl-2 text-sm font-bold mb-2">Phone</label>
          <input
            type="text"
            id="storePhone"
            placeholder="Enter store phone"
            className="w-full px-4 py-2 text-lg bg-card border-2 border-foreground/20 focus:border-foreground/50 rounded-xl transition-all placeholder:text-muted-foreground duration-500 focus:outline-none"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div className="mb-4 w-full">
          <label htmlFor="storeEmail" className="block text-gray-500 pl-2 text-sm font-bold mb-2">Email</label>
          <input
            type="email"
            id="storeEmail"
            placeholder="Enter store email"
            className="w-full px-4 py-2 text-lg bg-card border-2 border-foreground/20 focus:border-foreground/50 rounded-xl transition-all placeholder:text-muted-foreground duration-500 focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="mb-6 w-full">
          <label htmlFor="storeOwner" className="block text-gray-500 pl-2 text-sm font-bold mb-2">Store Owner</label>
          {loadingOwners ? (
            <div className="flex justify-center py-2">
              <Spinner />
            </div>
          ) : (
            <select
              id="storeOwner"
              className="w-full px-4 py-2 text-lg bg-card border-2 border-foreground/20 focus:border-foreground/50 rounded-xl transition-all placeholder:text-muted-foreground duration-500 focus:outline-none"
              value={owner_id}
              onChange={(e) => setOwnerId(e.target.value)}
              required
            >
              <option value="">Select a store owner</option>
              {storeOwners.map((owner) => (
                <option key={owner.id} value={owner.id}>
                  {owner.name} ({owner.email})
                </option>
              ))}
            </select>
          )}
        </div>
        <div className="flex items-center justify-center w-full">
          <button type="submit" className="w-full bg-blue-400 hover:bg-blue-500 text-lg text-white font-bold py-2 px-6 rounded-xl cursor-pointer focus:outline-none focus:shadow-outline mt-2 transition-all duration-500" disabled={loading || loadingOwners}>
            {loading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin h-7 w-7 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
            ) : (
              'Add Store'
            )}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default AddStoreForm;