import { useState, useEffect } from "react";
import client from "../api/client";
import { useNavigate } from 'react-router-dom';

const RestaurantManagement = () => {
  const [restaurants, setRestaurants] = useState([]);

  const [editingId, setEditingId] = useState(null);

  const [newRestaurant, setNewRestaurant] = useState({
    name: "",
    description: "",
    image: "",
    address: "",
    phone: "",
    categories: [],
    deliveryCharge: 0,
  });

  const [newCategory, setNewCategory] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const response = await client.get("api/restaurants");
      setRestaurants(response.data);
    } catch (error) {
      console.error("Error fetching restaurants:", error);
    }
  };

  // -------------------- IMAGE HANDLER --------------------
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  // -------------------- ADD RESTAURANT --------------------
  const handleAddRestaurant = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", newRestaurant.name);
      formData.append("description", newRestaurant.description);
      formData.append("address", newRestaurant.address);
      formData.append("phone", newRestaurant.phone);
      formData.append("deliveryCharge", newRestaurant.deliveryCharge);
      formData.append("categories", JSON.stringify(newRestaurant.categories));
      if (imageFile) formData.append("image", imageFile);

      await client.post("/api/restaurants/add", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      fetchRestaurants();
      resetForm();
    } catch (error) {
      console.error("Error adding restaurant:", error);
    }
  };

  // -------------------- START EDIT --------------------
  const startEdit = (restaurant) => {
    setEditingId(restaurant._id);

    setNewRestaurant({
      name: restaurant.name,
      description: restaurant.description,
      address: restaurant.address,
      phone: restaurant.phone,
      categories: restaurant.categories,
      deliveryCharge: restaurant.deliveryCharge,
    });

    setImagePreview(restaurant.image || "");
    setImageFile(null);
  };

  // -------------------- UPDATE RESTAURANT --------------------
  const handleUpdateRestaurant = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();
      formData.append("name", newRestaurant.name);
      formData.append("description", newRestaurant.description);
      formData.append("address", newRestaurant.address);
      formData.append("phone", newRestaurant.phone);
      formData.append("deliveryCharge", newRestaurant.deliveryCharge);
      formData.append("categories", JSON.stringify(newRestaurant.categories));
      if (imageFile) formData.append("image", imageFile);

      await client.put(`/api/restaurants/${editingId}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      fetchRestaurants();
      resetForm();
    } catch (error) {
      console.error("Error updating restaurant:", error);
    }
  };

  // -------------------- DELETE --------------------
  const handleDeleteRestaurant = async (id) => {
    try {
      await client.delete(`/api/restaurants/${id}`);
      fetchRestaurants();
    } catch (error) {
      console.error("Error deleting restaurant:", error);
    }
  };

  // -------------------- CATEGORY --------------------
  const addCategory = () => {
    if (newCategory.trim() && !newRestaurant.categories.includes(newCategory)) {
      setNewRestaurant({
        ...newRestaurant,
        categories: [...newRestaurant.categories, newCategory.trim()],
      });
      setNewCategory("");
    }
  };

  const removeCategory = (cat) => {
    setNewRestaurant({
      ...newRestaurant,
      categories: newRestaurant.categories.filter((c) => c !== cat),
    });
  };

  // -------------------- RESET FORM --------------------
  const resetForm = () => {
    setEditingId(null);
    setNewRestaurant({
      name: "",
      description: "",
      address: "",
      phone: "",
      categories: [],
      deliveryCharge: 0,
    });
    setImageFile(null);
    setImagePreview("");
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-800 text-center mb-8">
        Restaurant Management
      </h2>

      {/* -------------------- FORM -------------------- */}
      <form
        onSubmit={editingId ? handleUpdateRestaurant : handleAddRestaurant}
        className="flex flex-col gap-4 mb-8 bg-gray-50 p-6 rounded-lg"
      >
        <input
          className="p-3 border rounded-md"
          type="text"
          placeholder="Restaurant Name"
          value={newRestaurant.name}
          onChange={(e) =>
            setNewRestaurant({ ...newRestaurant, name: e.target.value })
          }
          required
        />

        <textarea
          className="p-3 border rounded-md"
          placeholder="Description"
          value={newRestaurant.description}
          onChange={(e) =>
            setNewRestaurant({ ...newRestaurant, description: e.target.value })
          }
        />

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Restaurant Image
          </label>
          <div className="flex items-center gap-4">
            <label className="cursor-pointer bg-white py-2 px-4 rounded-md border border-gray-300 hover:bg-gray-50">
              <span className="text-sm font-medium">Choose File</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </label>
            {imageFile && (
              <span className="text-sm text-gray-600">{imageFile.name}</span>
            )}
          </div>

          {imagePreview && (
            <div className="mt-2">
              <img
                src={imagePreview}
                alt="Preview"
                className="h-40 w-40 object-cover rounded-md border"
              />
            </div>
          )}
        </div>

        <input
          className="p-3 border rounded-md"
          type="text"
          placeholder="Address"
          value={newRestaurant.address}
          onChange={(e) =>
            setNewRestaurant({ ...newRestaurant, address: e.target.value })
          }
          required
        />

        <input
          className="p-3 border rounded-md"
          type="text"
          placeholder="Phone"
          value={newRestaurant.phone}
          onChange={(e) =>
            setNewRestaurant({ ...newRestaurant, phone: e.target.value })
          }
        />

        {/* CATEGORY INPUT */}
        <div>
          <div className="flex gap-2">
            <input
              className="flex-1 p-3 border rounded-md"
              type="text"
              placeholder="Add category"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />

            <button
              type="button"
              onClick={addCategory}
              className="py-2 px-4 rounded-md text-white"
              style={{ backgroundColor: "rgb(245,89,5)" }}
            >
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            {newRestaurant.categories.map((cat) => (
              <span
                key={cat}
                className="bg-orange-100 text-orange-700 px-3 py-1 rounded-full flex items-center"
              >
                {cat}
                <button
                  onClick={() => removeCategory(cat)}
                  className="ml-2 font-bold"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        <input
          type="number"
          className="p-3 border rounded-md"
          placeholder="Delivery Charge"
          value={newRestaurant.deliveryCharge}
          onChange={(e) =>
            setNewRestaurant({
              ...newRestaurant,
              deliveryCharge: Number(e.target.value),
            })
          }
        />

        <button
          type="submit"
          className="py-2 px-4 rounded-md text-white"
          style={{ backgroundColor: "rgb(245,89,5)" }}
        >
          {editingId ? "Update Restaurant" : "Add Restaurant"}
        </button>

        {editingId && (
          <button
            type="button"
            onClick={resetForm}
            className="bg-gray-300 py-2 px-4 rounded"
          >
            Cancel Edit
          </button>
        )}
      </form>

      {/* -------------------- RESTAURANT LIST -------------------- */}
      <ul className="space-y-3">
        {restaurants.map((restaurant) => (
          <li
            key={restaurant._id}
            className="bg-white shadow-sm border rounded-lg p-4 flex gap-4"
          >
            {/* IMAGE */}
            {restaurant.image ? (
              <img
                src={restaurant.image}
                className="w-24 h-24 rounded-lg object-cover border"
                alt=""
              />
            ) : (
              <div className="w-24 h-24 bg-gray-200 rounded"></div>
            )}

            <div className="flex-1">
              <h4 className="text-lg font-semibold">{restaurant.name}</h4>
              <p className="text-sm text-gray-600">{restaurant.address}</p>

              <div className="flex flex-wrap gap-1 mt-2">
                {restaurant.categories.map((c) => (
                  <span
                    key={c}
                    className="bg-orange-100 text-orange-700 px-2 py-1 rounded text-xs"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <button
                onClick={() => startEdit(restaurant)}
                className="px-3 py-1 text-white rounded"
                style={{ backgroundColor: "rgb(245,89,5)" }}
              >
                Edit
              </button>

              <button
                onClick={() => handleDeleteRestaurant(restaurant._id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
              <button
                onClick={() =>
                  navigate(`/admin/menu-management/${restaurant._id}`)
                }
                className="bg-blue-500 text-white px-3 py-1 rounded cursor-pointer"
              >
                Manage Menu
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RestaurantManagement;
