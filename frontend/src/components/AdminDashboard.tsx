import React, { useEffect, useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import AddUserForm from './AddUserForm';
import StoreList from './StoreList';
import UserList from './UserList';
import AddStoreForm from './AddStoreForm';
import Spinner from './Spinner';
import { useLocation } from 'react-router-dom';
import RatingIllustration from './RatingIllustration';

interface DashboardStats {
  totalUsers: number;
  totalStores: number;
  totalRatings: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const activeTab = queryParams.get('tab') || 'overview';

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const usersResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users`, {
          withCredentials: true,
        });
        const storesResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/stores`, {
          withCredentials: true,
        });
        const ratingsResponse = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/ratings/total`, {
          withCredentials: true,
        });

        setStats({
          totalUsers: usersResponse.data.length,
          totalStores: storesResponse.data.length,
          totalRatings: ratingsResponse.data.totalRatings,
        });
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
        toast.error('Failed to fetch dashboard statistics.');
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return <div className="wrapperx text-red-500">Error: {error}</div>;
  }

  return (
    <div className="wrapperx flex items-center justify-center">
      {activeTab === 'overview' && stats && (
        <div className='flex flex-col items-center justify-center'>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 max-w-7xl">
          <div className="bg-card p-6 rounded-lg border border-gray-300 min-w-[300px]">
            <h3 className="text-xl font-medium text-muted-foreground">Total Users</h3>
            <p className="text-4xl font-bold text-primary mt-2">{stats.totalUsers}</p>
          </div>
          <div className="bg-card p-6 rounded-lg border border-gray-300">
            <h3 className="text-xl font-medium text-muted-foreground">Total Stores</h3>
            <p className="text-4xl font-bold text-primary mt-2">{stats.totalStores}</p>
          </div>
          <div className="bg-card p-6 rounded-lg border border-gray-300">
            <h3 className="text-xl font-medium text-muted-foreground">Total Ratings</h3>
            <p className="text-4xl font-bold text-primary mt-2">{stats.totalRatings}</p>
          </div>
        </div>
        <RatingIllustration height={393.65484} width={575.03315} className='pt-10 p-12 md:scale-100 scale-50' />
        </div>
      )}

      {activeTab === 'addUser' && <AddUserForm />}
      {activeTab === 'addStore' && <AddStoreForm />}
      {activeTab === 'userList' && <UserList />}
      {activeTab === 'storeList' && <StoreList />}
    </div>
  );
};

export default AdminDashboard;
