import React from "react";
import { useParams, Link } from "react-router-dom";
import { Typography, Tabs, Tab, Box, Grid } from "@mui/material";
import emptyCart from "../assets/empty-cart.svg";
import { useQuery } from "@tanstack/react-query";
import Loader from "../components/loader";
import client from "../api/client";
import { useCart } from "../context/cart-context";
import menuIcon from "../assets/menu-ico.svg";
import reviewIcon from "../assets/icon_reviews.svg";
import infoIcon from "../assets/icon_info_menu.svg";
import MenuDetails from "../components/menu-details";
import ReviewsSection from "../components/review-section";
import InfoSection from "../components/info-section";
import { useNavigate } from "react-router-dom";

const fetchRestaurantById = async (id) => {
  const res = await client.get(`/api/restaurants/${id}`);
  return res.data;
};

export default function RestaurantDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { addItemToCart, cartItems, removeItemFromCart } = useCart();

  const [selectedCategory, setSelectedCategory] = React.useState("All");
  const [tabValue, setTabValue] = React.useState(0);

  const {
    data: restaurantData,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["restaurant", id],
    queryFn: () => fetchRestaurantById(id),
  });

  if (isLoading) return <Loader />;
  if (isError)
    return <Typography sx={{ p: 4 }}>Failed to load restaurant.</Typography>;

  const menuItems = restaurantData.menuItems || [];
  const restaurant = restaurantData.restaurant || {};
  const categories = restaurant.categories || [];

  const checkoutOrder = async (items) => {
    const res = await client.post("/api/cart/checkout", {
      items,
    });
    return res.data;
  };

  const handleCheckout = async () => {
    try {
      const formattedItems = cartItems.map((item) => ({
        id: item._id,
        qty: item.quantity,
        price: item.price,
      }));

      const result = await checkoutOrder(formattedItems);

      navigate("/order-summary");
    } catch (error) {
      alert("Checkout failed. Please try again.");
    }
  };

  const updateItemQuantity = (id, qty) => {
    const item = cartItems.find((i) => i._id === id);
    if (!item) return;

    if (qty <= 0) {
      removeItemFromCart(id);
    } else {
      // Remove old and add new quantity
      removeItemFromCart(id);
      for (let i = 0; i < qty; i++) {
        addItemToCart(item);
      }
    }
  };

  const filteredMenuItems =
    selectedCategory === "All"
      ? menuItems
      : menuItems.filter((item) => item.category === selectedCategory);

  function TabPanel({ value, index, children }) {
    return value === index && <Box sx={{ mt: 3 }}>{children}</Box>;
  }
  return (
    <Box className="p-4 md:p-6 bg-gray-100 min-h-screen">
      {/* Restaurant Details */}
      <div className="bg-white p-4 md:p-6 mb-4 rounded-lg flex flex-col md:flex-row gap-4 md:gap-6 items-start">
        {restaurant.image && (
          <div className="w-full md:w-64 shrink-0">
            <img
              src={restaurant.image}
              alt={restaurant.name}
              className="w-full h-auto rounded-lg"
            />
          </div>
        )}
        <div className="flex-1">
          <h1 className="text-2xl md:text-4xl font-bold">{restaurant.name}</h1>
          <p className="text-gray-600 mt-2">{restaurant.description}</p>
          <p className="text-gray-600 mt-1">
            {restaurant.address} • {restaurant.phone}
          </p>
        </div>
      </div>

      {/* Tabs */}
      <Tabs
        value={tabValue}
        onChange={(e, newValue) => setTabValue(newValue)}
        textColor="inherit"
        indicatorColor="primary"
        className="mb-3 w-full"
        variant="fullWidth"
      >
        <Tab
          icon={<img src={menuIcon} width={18} />}
          iconPosition="start"
          label="Menu"
        />
        <Tab
          icon={<img src={reviewIcon} width={18} />}
          iconPosition="start"
          label="Reviews"
        />
        <Tab
          icon={<img src={infoIcon} width={18} />}
          iconPosition="start"
          label="Info"
        />
      </Tabs>

      {/* Main Content */}
      <div className="flex flex-col md:flex-row gap-4 md:gap-6">
        {/* Tab Content */}
        <div className="flex-1">
          <TabPanel value={tabValue} index={0}>
            <MenuDetails
              filteredMenuItems={filteredMenuItems}
              selectedCategory={selectedCategory}
              setSelectedCategory={setSelectedCategory}
              categories={categories}
              addItemToCart={addItemToCart}
            />{" "}
          </TabPanel>
          <TabPanel value={tabValue} index={1}>
            <ReviewsSection restaurantId={restaurant._id} />
          </TabPanel>
          <TabPanel value={tabValue} index={2}>
            <InfoSection restaurant={restaurant} />
          </TabPanel>
        </div>

        {/* Cart */}
        <div className="w-full md:w-72 shrink-0">
          {/* Cart Header */}
          <div className="bg-orange-500 text-white font-bold text-lg text-center p-3 rounded-t-lg">
            Your Cart ({cartItems.length})
          </div>

          {/* Empty Cart */}
          {cartItems.length === 0 ? (
            <div className="bg-white p-4 flex flex-col items-center justify-center rounded-b-lg">
              <img src={emptyCart} alt="Empty Cart" className="max-h-36 mb-2" />
              <p>No items in the shopping cart.</p>
            </div>
          ) : (
            <div className="bg-white p-4 flex flex-col gap-3 rounded-b-lg">
              {cartItems.map((item) => (
                <div
                  key={item._id}
                  className="flex justify-between items-center border-b border-gray-200 pb-1"
                >
                  <div>
                    <p className="font-bold">{item.name}</p>
                    <p className="text-gray-500 text-sm">
                      ${item.price} × {item.quantity}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        if (item.quantity === 1) removeItemFromCart(item._id);
                        else updateItemQuantity(item._id, item.quantity - 1);
                      }}
                      className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center"
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateItemQuantity(item._id, item.quantity + 1)
                      }
                      className="w-6 h-6 bg-gray-200 rounded flex items-center justify-center"
                    >
                      +
                    </button>
                  </div>

                  <p className="font-bold">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}

              {/* Delivery Charge */}
              <div className="flex justify-between mt-1">
                <p className="font-medium">Delivery Charge</p>
                <p className="font-medium">${restaurant.deliveryCharge || 0}</p>
              </div>

              {/* Total */}
              <div className="flex justify-between mt-1 font-bold text-lg">
                <p>Total</p>
                <p>
                  $
                  {(
                    cartItems.reduce(
                      (acc, item) => acc + item.price * item.quantity,
                      0
                    ) + (restaurant.deliveryCharge || 0)
                  ).toFixed(2)}
                </p>
              </div>
            </div>
          )}

          <Link to="/order-summary" className="mt-2 block">
            <button
              className="w-full bg-orange-500 text-white py-3 rounded-lg text-lg cursor-pointer"
              onClick={handleCheckout}
            >
              Checkout
            </button>
          </Link>
        </div>
      </div>
    </Box>
  );
}
