import { useState, useEffect } from "react";
import client from "../api/client";
import { useParams } from "react-router-dom";

const MenuManagement = () => {
    const { id: restaurantId } = useParams();
  const [menus, setMenus] = useState([]);
  const [editingId, setEditingId] = useState(null);

  const [menuData, setMenuData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    available: true,
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  // -------------------------------------------------------
  // FETCH MENUS FOR RESTAURANT
  // -------------------------------------------------------
  const fetchMenus = async () => {
    try {
      const res = await client.get(`/api/menus/restaurant/${restaurantId}`);
      setMenus(res.data);
    } catch (error) {
      console.error("Error fetching menus", error);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, [restaurantId]);

  // -------------------------------------------------------
  // IMAGE HANDLER
  // -------------------------------------------------------
  const handleImageChange = (e) => {
    const f = e.target.files[0];
    if (f) {
      setImageFile(f);
      setImagePreview(URL.createObjectURL(f));
    }
  };

  // -------------------------------------------------------
  // RESET FORM
  // -------------------------------------------------------
  const resetForm = () => {
    setEditingId(null);
    setMenuData({
      name: "",
      description: "",
      price: "",
      category: "",
      available: true,
    });
    setImageFile(null);
    setImagePreview("");
  };

  // -------------------------------------------------------
  // ADD MENU
  // -------------------------------------------------------
  const handleAdd = async (e) => {
    e.preventDefault();

    try {
      const form = new FormData();
      form.append("restaurant", restaurantId);
      form.append("name", menuData.name);
      form.append("description", menuData.description);
      form.append("price", menuData.price);
      form.append("category", menuData.category);
      form.append("available", menuData.available);

      if (imageFile) form.append("image", imageFile);

      await client.post("/api/menus/add", form);

      fetchMenus();
      resetForm();
    } catch (error) {
      console.error("Error adding menu", error);
    }
  };

  // -------------------------------------------------------
  // START EDIT
  // -------------------------------------------------------
  const startEdit = (item) => {
    setEditingId(item._id);
    setMenuData({
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      available: item.available,
    });
    setImagePreview(item.image || "");
    setImageFile(null);
  };

  // -------------------------------------------------------
  // UPDATE MENU
  // -------------------------------------------------------
  const handleUpdate = async (e) => {
    e.preventDefault();
console.log("===============update")
    try {
      const form = new FormData();
      form.append("name", menuData.name);
      form.append("description", menuData.description);
      form.append("price", menuData.price);
      form.append("category", menuData.category);
      form.append("available", menuData.available);
      form.append("restaurant", restaurantId);

      if (imageFile) form.append("image", imageFile);

      await client.put(`/api/menus/${editingId}`, form);

      fetchMenus();
      resetForm();
    } catch (error) {
      console.error("Error updating menu", error);
    }
  };

  // -------------------------------------------------------
  // DELETE MENU
  // -------------------------------------------------------
  const handleDelete = async (id) => {
    try {
      await client.delete(`/api/menus/${id}`);
      fetchMenus();
    } catch (error) {
      console.error("Error deleting menu", error);
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-semibold mb-4">Menu Management</h2>

      {/* FORM */}
      <form
        onSubmit={editingId ? handleUpdate : handleAdd}
        className="space-y-3 bg-gray-100 p-4 rounded"
      >
        <input
          type="text"
          placeholder="Menu Name"
          value={menuData.name}
          onChange={(e) => setMenuData({ ...menuData, name: e.target.value })}
          className="p-2 border w-full rounded"
          required
        />

        <textarea
          placeholder="Description"
          value={menuData.description}
          onChange={(e) =>
            setMenuData({ ...menuData, description: e.target.value })
          }
          className="p-2 border w-full rounded"
        />

        <input
          type="number"
          placeholder="Price"
          value={menuData.price}
          onChange={(e) =>
            setMenuData({ ...menuData, price: Number(e.target.value) })
          }
          className="p-2 border w-full rounded"
          required
        />

        <input
          type="text"
          placeholder="Category"
          value={menuData.category}
          onChange={(e) =>
            setMenuData({ ...menuData, category: e.target.value })
          }
          className="p-2 border w-full rounded"
          required
        />

        <select
          value={menuData.available}
          onChange={(e) =>
            setMenuData({ ...menuData, available: e.target.value === "true" })
          }
          className="p-2 border rounded w-full"
        >
          <option value="true">Available</option>
          <option value="false">Not Available</option>
        </select>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Menu Image
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

        <button
          type="submit"
          className="bg-orange-600 text-white px-4 py-2 rounded w-full cursor-pointer"
        >
          {editingId ? "Update Menu" : "Add Menu"}
        </button>

        {editingId && (
          <button
            type="button"
            onClick={resetForm}
            className="bg-gray-300 px-4 py-2 rounded w-full cursor-pointer"
          >
            Cancel Edit
          </button>
        )}
      </form>

      {/* MENU LIST */}
      <div className="mt-6 space-y-3">
        {menus.map((item) => (
          <div
            key={item._id}
            className="p-4 bg-white border rounded flex gap-4"
          >
            <img
              src={item.image}
              className="h-20 w-20 object-cover rounded border"
              alt=""
            />

            <div className="flex-1">
              <h4 className="font-semibold">{item.name}</h4>
              <p className="text-gray-600 text-sm">{item.category}</p>
              <p className="text-sm">{item.price} AED</p>
            </div>

            <div className="flex flex-col gap-2">
              <button
                className="bg-orange-600 text-white px-3 py-1 rounded cursor-pointer"
                onClick={() => startEdit(item)}
              >
                Edit
              </button>
              <button
                className="bg-red-500 text-white px-3 py-1 rounded cursor-pointer" 
                onClick={() => handleDelete(item._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenuManagement;
