import { useEffect, useState } from "react";
import client from "../api/client";
import { useAuth } from "../context/auth-context";

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const { authUser } = useAuth();

  const fetchOrders = async () => {
    try {
      const res = await client.get("api/orders");
      setOrders(res.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (orderId, status) => {
    try {
      await client.put(`api/orders/${orderId}/status`, { status });
      fetchOrders();
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  };

  if (loading) return <p className="text-center">Loading orders...</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800 tracking-wide">
        Order Management
      </h1>

      <div className="grid gap-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="border border-gray-200 p-6 rounded-xl shadow-md bg-white hover:shadow-lg transition-all duration-200"
          >
            {/* Order Header */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-xl text-gray-900">
                Order #{order._id.slice(-6)}
              </h2>

              <span
                className="px-3 py-1 rounded-full text-sm font-semibold
            bg-blue-100 text-blue-700"
              >
                {order.status}
              </span>
            </div>

            {/* Body */}
            <div className="space-y-2 text-gray-700">
              <p>
                <strong>User:</strong> {order.user?.name} ({order.user?.email})
              </p>

              <p>
                <strong>Total:</strong>{" "}
                <span className="font-semibold text-gray-900">
                  ₹{order.totalAmount}
                </span>
              </p>

              <p className="font-semibold mt-4">Items:</p>

              <ul className="ml-6 list-disc text-gray-600">
                {order.items.map((item) => (
                  <li key={item._id}>
                    {item.name} — {item.quantity} × ₹{item.price}
                  </li>
                ))}
              </ul>
            </div>

            {/* Dropdowns */}
            <div className="mt-6 flex gap-4">
              <select
                value={order.status}
                onChange={(e) => updateStatus(order._id, e.target.value)}
                className="border px-3 py-2 rounded-lg bg-gray-50 text-gray-700 shadow-sm
            hover:bg-gray-100 focus:ring-2 focus:ring-blue-400 focus:outline-none transition w-48"
              >
                <option value="Pending">Pending</option>
                <option value="Accepted">Accepted</option>
                <option value="Preparing">Preparing</option>
                <option value="Out for delivery">Out for delivery</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderManagement;
