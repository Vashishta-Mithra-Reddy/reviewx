import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import Spinner from "./Spinner";
import StarRating from "./StarRating";

interface Store {
  id: string;
  name: string;
  email: string;
  address: string;
  averageRating: string | null;
}

const StoreList: React.FC = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filterName, setFilterName] = useState("");
  const [filterAddress, setFilterAddress] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // ✅ Debounced filters
  const [debouncedFilterName, setDebouncedFilterName] = useState("");
  const [debouncedFilterAddress, setDebouncedFilterAddress] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedFilterName(filterName), 400);
    return () => clearTimeout(handler);
  }, [filterName]);

  useEffect(() => {
    const handler = setTimeout(() => setDebouncedFilterAddress(filterAddress), 400);
    return () => clearTimeout(handler);
  }, [filterAddress]);

  // ✅ Fetch stores once
  useEffect(() => {
    const fetchStores = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/stores`, {
          withCredentials: true,
        });
        setStores(res.data);
      } catch (err) {
        console.error("Error fetching stores:", err);
        toast.error("Failed to fetch stores.");
        setError("Failed to load stores.");
      } finally {
        setLoading(false);
      }
    };
    fetchStores();
  }, []);

  // ✅ Client-side filter + sort
  const filteredAndSortedStores = useMemo(() => {
    let filtered = [...stores];

    if (debouncedFilterName.trim()) {
      filtered = filtered.filter((store) =>
        store.name.toLowerCase().includes(debouncedFilterName.toLowerCase())
      );
    }
    if (debouncedFilterAddress.trim()) {
      filtered = filtered.filter((store) =>
        store.address.toLowerCase().includes(debouncedFilterAddress.toLowerCase())
      );
    }

    filtered.sort((a, b) => {
      let aVal: string | number = a[sortBy as keyof Store] ?? "";
      let bVal: string | number = b[sortBy as keyof Store] ?? "";

      // Handle rating sort numerically
      if (sortBy === "averageRating") {
        aVal = a.averageRating ? parseFloat(a.averageRating) : 0;
        bVal = b.averageRating ? parseFloat(b.averageRating) : 0;
      } else {
        aVal = aVal.toString().toLowerCase();
        bVal = bVal.toString().toLowerCase();
      }

      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1;
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [stores, debouncedFilterName, debouncedFilterAddress, sortBy, sortOrder]);

  if (loading) return <Spinner />;
  if (error) return <div className="wrapperx text-red-500">Error: {error}</div>;

  return (
    <motion.div
      initial={{ y: 10, opacity: 0, filter: "blur(5px)" }}
      animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
      exit={{ y: 10, opacity: 0, filter: "blur(5px)" }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
      className="px-12 pt-12 pb-6 rounded-xl w-full max-w-7xl bg-white border border-gray-300"
    >
      <h3 className="text-3xl mb-12 font-semibold text-center">Store List</h3>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        <div>
          <label className="block text-gray-500 pl-2 text-sm font-bold mb-2">
            Filter by Name
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 text-lg bg-card border-2 border-foreground/20 focus:border-foreground/50 rounded-xl transition-all duration-500 focus:outline-none"
            value={filterName}
            onChange={(e) => setFilterName(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-gray-500 pl-2 text-sm font-bold mb-2">
            Filter by Address
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 text-lg bg-card border-2 border-foreground/20 focus:border-foreground/50 rounded-xl transition-all duration-500 focus:outline-none"
            value={filterAddress}
            onChange={(e) => setFilterAddress(e.target.value)}
          />
        </div>

        <div>
          <label className="block text-gray-500 pl-2 text-sm font-bold mb-2">
            Sort By
          </label>
          <select
            className="w-full px-4 py-2 text-lg bg-card border-2 border-foreground/20 focus:border-foreground/50 rounded-xl transition-all duration-500 focus:outline-none"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="name">Name</option>
            <option value="email">Email</option>
            <option value="address">Address</option>
            <option value="averageRating">Rating</option>
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
                Address
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Rating
              </th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            {filteredAndSortedStores.map((store) => (
              <tr key={store.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-foreground">
                  {store.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  {store.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  {store.address}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                  <div className="flex items-center">
                    {store.averageRating || "N/A"}
                    {store.averageRating && (
                      <StarRating rating={Number(store.averageRating)} />
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default StoreList;
