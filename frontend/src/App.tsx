import { Routes, Route, Navigate } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Home from './components/Home';
import UserDashboard from './components/UserDashboard';
import AdminDashboard from './components/AdminDashboard';
import StoreOwnerDashboard from './components/StoreOwnerDashboard';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './context/AuthContext';
import Spinner from './components/Spinner';
import Header from './components/Header';

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return <Spinner />;
  }

  return (
    <>
      <Toaster />
      {user && <Header role={user.role as "user" | "admin" | "store_owner"} />}
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {user ? (
          <Route path="/" element={
            user.role === 'user' ? <UserDashboard /> :
            user.role === 'admin' ? <AdminDashboard /> :
            user.role === 'store_owner' ? <StoreOwnerDashboard /> :
            <Home />
          } />
        ) : (
          <Route path="/" element={<Home />} />
        )}

        {/* Protected routes based on role */}
        {user && user.role === 'user' && (
          <Route path="/dashboard" element={<UserDashboard />} />
        )}
        {user && user.role === 'admin' && (
          <Route path="/dashboard" element={<AdminDashboard />} />
        )}
        {user && user.role === 'store_owner' && (
          <Route path="/dashboard" element={<StoreOwnerDashboard />} />
        )}

        {/* Redirect unauthenticated users from protected routes */}
        <Route path="/dashboard" element={<Navigate to="/login" />} />
      </Routes>
    </>
  );
}

export default App;
