import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import client from "../api/client";

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [totalOrders, setTotalOrders] = useState(0);
  const [activeRestaurants, setActiveRestaurants] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch orders
      const ordersRes = await client.get("/api/orders");
      setOrders(ordersRes.data);
      setTotalOrders(ordersRes.data.length);
      const revenue = ordersRes.data.reduce(
        (sum, order) => sum + order.totalAmount,
        0
      );
      setTotalRevenue(revenue);

      // Fetch restaurants
      const restaurantsRes = await client.get("/api/restaurants");
      setActiveRestaurants(restaurantsRes.data.length);
     
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading dashboard...</p>;

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* ===== SIDEBAR ===== */}
      <aside className="w-64 bg-white shadow-md p-4 flex flex-col gap-4">
        <h2 className="text-xl font-semibold text-orange-600 mb-2">Admin Panel</h2>
        <nav className="flex flex-col gap-3">
          <Link to="/admin" className="py-2 px-3 bg-orange-100 rounded hover:bg-orange-200 text-center">Dashboard</Link>
          <Link to="/admin/restaurants" className="py-2 px-3 bg-orange-100 rounded hover:bg-orange-200 text-center">Restaurants</Link>
          <Link to="/admin/orders" className="py-2 px-3 bg-orange-100 rounded hover:bg-orange-200 text-center">Orders</Link>
        </nav>
      </aside>

      {/* ===== MAIN CONTENT ===== */}
      <main className="flex-1 p-6">
        <header className="bg-white p-4 rounded shadow-md mb-6">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-lg font-semibold text-gray-800">Total Orders</h2>
            <p className="text-3xl font-bold mt-2 text-orange-600">{totalOrders}</p>
          </div>

          <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-lg font-semibold text-gray-800">Total Revenue</h2>
            <p className="text-3xl font-bold mt-2 text-orange-600">AED {totalRevenue}</p>
          </div>

          <div className="bg-white p-6 rounded shadow-md">
            <h2 className="text-lg font-semibold text-gray-800">Active Restaurants</h2>
            <p className="text-3xl font-bold mt-2 text-orange-600">{activeRestaurants}</p>
          </div>
        </section>

        {/* ===== Recent Orders ===== */}
        <section className="bg-white p-6 rounded shadow-md">
          <h2 className="text-lg font-semibold mb-4">Recent Orders</h2>
          <div className="flex flex-col gap-3">
            {orders.slice(0, 5).map((order) => (
              <div key={order._id} className="p-3 bg-orange-100 rounded flex justify-between items-center">
                <span>Order #{order._id.slice(-6)}</span>
                <span>Status: {order.status}</span>
                <span>Total: AED {order.totalAmount}</span>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
