import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import Spinner from "./Spinner";

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  address: string;
}

const UserList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filterName, setFilterName] = useState("");
  const [filterEmail, setFilterEmail] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [sortField, setSortField] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // ✅ Fetch users once on mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/users`, {
          withCredentials: true,
        });
        setUsers(response.data);
      } catch (err) {
        console.error("Error fetching users:", err);
        toast.error("Failed to fetch users.");
        setError("Failed to load users.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // ✅ Use memoized filtering & sorting (no re-fetch)
  const filteredAndSortedUsers = useMemo(() => {
    let filtered = [...users];

    if (filterName.trim()) {
      filtered = filtered.filter((user) =>
        user.name.toLowerCase().includes(filterName.toLowerCase())
      );
    }
    if (filterEmail.trim()) {
      filtered = filtered.filter((user) =>
        user.email.toLowerCase().includes(filterEmail.toLowerCase())
      );
    }
    if (filterRole.trim()) {
      filtered = filtered.filter((user) => user.role === filterRole);
    }

    filtered.sort((a, b) => {
      const aVal = a[sortField as keyof User]?.toString().toLowerCase() ?? "";
      const bVal = b[sortField as keyof User]?.toString().toLowerCase() ?? "";

      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [users, filterName, filterEmail, filterRole, sortField, sortOrder]);

  if (loading) return <Spinner />;
  if (error) return <div className="wrapperx text-red-500">Error: {error}</div>;

  return (
    <motion.div
      initial={{ y: 10, opacity: 0, filter: "blur(5px)" }}
      animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
      exit={{ y: 10, opacity: 0, filter: "blur(5px)" }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="px-12 pt-12 pb-6 rounded-xl w-full max-w-7xl border border-gray-300 bg-white"
    >
      <h2 className="text-3xl mb-12 font-semibold text-center">User List</h2>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-gray-500 pl-2 text-sm font-bold mb-2">
            Filter by Name
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 text-lg bg-card border-2 border-foreground/20 focus:border-foreground/50 rounded-xl transition-all placeholder:text-muted-foreground duration-500 focus:outline-none"
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-gray-500 pl-2 text-sm font-bold mb-2">
            Filter by Email
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 text-lg bg-card border-2 border-foreground/20 focus:border-foreground/50 rounded-xl transition-all placeholder:text-muted-foreground duration-500 focus:outline-none"
            value={filterEmail}
            onChange={(e) => setFilterEmail(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-gray-500 pl-2 text-sm font-bold mb-2">
            Filter by Role
          </label>
          <select
            className="w-full px-4 py-2 text-lg bg-card border-2 border-foreground/20 focus:border-foreground/50 rounded-xl transition-all duration-500 focus:outline-none"
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value)}
          >
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="user">Normal User</option>
            <option value="store_owner">Store Owner</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-500 pl-2 text-sm font-bold mb-2">
            Sort By
          </label>
          <select
            className="w-full px-4 py-2 text-lg bg-card border-2 border-foreground/20 focus:border-foreground/50 rounded-xl transition-all duration-500 focus:outline-none"
            value={sortField}
            onChange={(e) => setSortField(e.target.value)}
          >
            <option value="name">Name</option>
            <option value="email">Email</option>
            <option value="role">Role</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-500 pl-2 text-sm font-bold mb-2">
            Sort Order
          </label>
          <select
            className="w-full px-4 py-2 text-lg bg-card border-2 border-foreground/20 focus:border-foreground/50 rounded-xl transition-all duration-500 focus:outline-none"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as "asc" | "desc")}
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-background">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Address
              </th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {filteredAndSortedUsers.map((user) => (
              <tr key={user._id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                  {user.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  {user.role}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  {user.address}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default UserList;
