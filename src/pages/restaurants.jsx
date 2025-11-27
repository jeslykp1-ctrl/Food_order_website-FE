import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  Box,
  TextField,
  Checkbox,
  FormControlLabel,
  Card,
  CardContent,
  Typography,
  Divider,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import client from "../api/client"; 
import Loader from "../components/loader"

const fetchRestaurants = async () => {
  const res = await client.get("api/restaurants");
  return res.data; // assuming API returns array of restaurants
};

const sortOptions = [
  { label: "From A to Z", value: "name" },
  { label: "Delivery fees", value: "deliveryCharge" },
];

const RestaurantListing = () => {
  const {
    data: allRestaurants = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["restaurants"],
    queryFn: fetchRestaurants,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("name");
  const [freeDelivery, setFreeDelivery] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleSearch = (e) => setSearchTerm(e.target.value.toLowerCase());

  const toggleCategory = (category) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  // Extract categories dynamically from API data
  const allCategories = useMemo(() => {
    return Array.from(
      new Set(allRestaurants.flatMap((r) => r.categories || []))
    );
  }, [allRestaurants]);

  const displayedRestaurants = useMemo(() => {
    let list = [...allRestaurants];

    if (searchTerm) {
      list = list.filter((r) => r.name.toLowerCase().includes(searchTerm));
    }

    if (freeDelivery) {
      list = list.filter((r) => r.deliveryCharge === 0);
    }

    if (selectedCategories.length > 0) {
      list = list.filter((r) =>
        r.categories?.some((c) => selectedCategories.includes(c))
      );
    }

    list.sort((a, b) => {
      if (sortOption === "name") return a.name.localeCompare(b.name);
      if (sortOption === "deliveryCharge")
        return a.deliveryCharge - b.deliveryCharge;
      return 0;
    });

    return list;
  }, [
    allRestaurants,
    searchTerm,
    freeDelivery,
    selectedCategories,
    sortOption,
  ]);

  if (isLoading) return <Loader />;

  if (isError)
    return <Typography sx={{ p: 4 }}>Failed to load restaurants</Typography>;

  return (
    <div className="p-4 md:mx-10 mx-2">
      {/* Search + Sort */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 flex-wrap mb-2">
        <input
          type="text"
          placeholder="Search restaurants..."
          className="border rounded px-3 py-2 text-sm w-full sm:w-auto"
          value={searchTerm}
          onChange={handleSearch}
        />

        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold">Sort by:</span>
          {sortOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setSortOption(option.value)}
              className={`px-2 py-0.5 rounded-full text-sm cursor-pointer select-none ${
                sortOption === option.value
                  ? "bg-orange-600 text-white hover:bg-orange-700"
                  : "hover:bg-gray-200"
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <hr className="mb-2" />

      <div className="flex flex-col md:flex-row gap-3">
        {/* Sidebar Filters */}
        <div className="w-full md:w-64 bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-3">Filters</h3>
          
          {/* Free Delivery Filter */}
          <div className="mb-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={freeDelivery}
                onChange={(e) => setFreeDelivery(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
              />
              <span className="text-sm font-medium text-gray-700">Free Delivery</span>
            </label>
          </div>

          {/* Categories Filter */}
          <div>
            <h4 className="font-bold text-sm mb-2">Categories</h4>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
              {allCategories.map((cat) => (
                <label key={cat} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(cat)}
                    onChange={() => toggleCategory(cat)}
                    className="h-4 w-4 rounded border-gray-300 text-orange-600 focus:ring-orange-500"
                  />
                  <span className="text-sm text-gray-700">{cat}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Restaurant List */}
        <div className="flex-1">
          {displayedRestaurants.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-500">No restaurants match your filters.</p>
              <button 
                onClick={() => {
                  setSearchTerm('');
                  setFreeDelivery(false);
                  setSelectedCategories([]);
                }}
                className="mt-2 text-orange-600 hover:text-orange-700 text-sm font-medium"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 md:grid-cols-1 gap-3">
              {displayedRestaurants.map((r) => (
                <Link
                  key={r._id}
                  to={`/restaurants/${r._id}`}
                  className="no-underline"
                >
                  <div className="flex flex-col sm:flex-row mb-2 p-2 border-b border-gray-500 hover:shadow-md transition-shadow">
                    <img
                      src={r.image || "https://via.placeholder.com/150?text=No+Image"}
                      alt={r.name}
                      className="w-full sm:w-36 h-45 sm:h-24 object-cover rounded-lg sm:mr-2 mb-2 sm:mb-0"
                    />

                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{r.name}</h3>

                      <p className="text-gray-500 text-sm mb-1 line-clamp-2">
                        {r.description}
                      </p>

                      <div className="grid grid-cols-1 xs:grid-cols-2 gap-1 text-sm">
                        <p>📍 {r.address}</p>
                        <p>📞 {r.phone}</p>
                        <p>
                          Categories:{" "}
                          <strong className="line-clamp-1">
                            {r.categories?.join(", ") || "No categories"}
                          </strong>
                        </p>
                        <p>
                          Delivery:{" "}
                          <strong>
                            {r.deliveryCharge === 0
                              ? "Free"
                              : `${r.deliveryCharge} AED`}
                          </strong>
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RestaurantListing;
