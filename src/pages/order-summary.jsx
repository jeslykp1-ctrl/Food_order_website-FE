import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Divider,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import client from "../api/client";
import Loader from "../components/loader";
import { loadStripe } from "@stripe/stripe-js";
import { useCart } from "../context/cart-context";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export default function OrderSummary() {
  const [cartData, setCartData] = useState([]);

  // GET CART API
  const {
    data: cartItems,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const res = await client.get("api/cart");
      setCartData(res.data.items || []);
      return res.data;
    },
  });
  const clearCart = useCart().clearCart;

  const [paymentMethod, setPaymentMethod] = useState(null);

  if (isLoading) return <Loader />;
  if (isError) return <p className="text-center py-10">Failed to load cart.</p>;

  const subtotal = cartData.reduce(
    (acc, item) => acc + item.menuItem.price * item.quantity,
    0
  );
  const total = subtotal + cartItems.serviceFee + cartItems.deliveryFee;

  const handleCheckout = async () => {
    try {
      const stripe = await stripePromise;

      const response = await client.post(
        "/api/payment/create-checkout-session"
      );

      if (response.data.url) {
        window.location.href = response.data.url;
      } else {
        console.error("No URL returned from backend");
      }
    } catch (err) {
      console.error(err);
    }
  };
  const handlePlaceOrder = () => {
    if (paymentMethod === "card") {
      handleCheckout();
    } else {
      window.location.href = "/order-confirm";
      clearCart();
    }
  };
  if (cartData.length === 0) {
    return (
      <div className="text-[50px] flex justify-center items-center">
        Your cart is empty
      </div>
    );
  }
  return (
    <Box className="min-h-screen bg-gray-100 p-4 md:p-6 flex flex-col gap-4 lg:px-[10%] xl:px-[20%]">
      {/* Order Summary */}
      <Card className="shadow-lg border border-gray-200 rounded-lg">
        <CardContent className="p-4 md:p-6">
          <Typography
            variant="h5"
            className="font-semibold pb-6 text-center text-orange-600"
          >
            Order Summary
          </Typography>

          {/* Header Row */}
          <Box className="flex justify-between p-2 border-b border-gray-200 font-bold bg-gray-50">
            <Typography className="font-bold">Item</Typography>
            <div className="flex gap-10">
              <Typography className="font-bold">Qty</Typography>
              <Typography className="font-bold">Price</Typography>
            </div>
          </Box>

          {/* Items */}
          {cartItems.items.map((item) => (
            <Box
              key={item._id}
              className="flex justify-between py-2 border-b border-gray-100"
            >
              <Typography>{item.menuItem.name}</Typography>
              <div className="flex gap-10">
                <Typography>{item.quantity}</Typography>
                <Typography>AED {item.menuItem.price}</Typography>
              </div>
            </Box>
          ))}
        </CardContent>
      </Card>

      {/* Address - use your real address API later */}
      <Card className="shadow-lg border border-gray-200 rounded-lg">
        <CardContent className="p-4 md:p-6">
          <Typography
            variant="h5"
            className="font-semibold mb-6 text-center border-b pb-2 text-orange-600"
          >
            Delivery Address
          </Typography>
          <Box className="flex flex-col gap-2 ps-2 pt-2">
            <Typography className="font-medium">John Doe</Typography>
            <Typography>+971 50 123 4567</Typography>
            <Typography>Flat 308, Marina Bay Towers</Typography>
            <Typography>Dubai</Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Payment + Summary */}
      <Box className="flex flex-col lg:flex-row gap-4">
        {/* Payment */}
        <Card className="shadow-lg border border-gray-200 rounded-lg flex-1">
          <CardContent className="p-4 md:p-6">
            <Typography
              variant="h5"
              className="font-semibold mb-4 text-center border-b pb-2 text-orange-600"
            >
              Payment Options
            </Typography>

            <FormControl className="w-full pt-4">
              <RadioGroup
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
              >
                <FormControlLabel
                  value="card"
                  control={<Radio />}
                  label="Credit Card"
                  className="bg-white rounded-lg px-4 py-2 border mb-2"
                />
                <FormControlLabel
                  value="cod"
                  control={<Radio />}
                  label="Cash on Delivery"
                  className="bg-white rounded-lg px-4 py-2 border"
                />
              </RadioGroup>
            </FormControl>
          </CardContent>
        </Card>

        {/* Summary */}
        <Card className="shadow-lg border border-gray-200 rounded-lg lg:w-1/3">
          <CardContent className="p-4 md:p-6">
            <Typography variant="h6" className="font-semibold mb-4">
              Summary
            </Typography>

            <Box className="space-y-2">
              <Box className="flex justify-between">
                <Typography>Subtotal</Typography>
                <Typography>AED {subtotal.toFixed(2)}</Typography>
              </Box>
              <Box className="flex justify-between">
                <Typography>Delivery Fee</Typography>
                <Typography>AED {cartData.deliveryFee}</Typography>
              </Box>
              <Box className="flex justify-between">
                <Typography>Service Fee</Typography>
                <Typography>AED {cartData.serviceFee}</Typography>
              </Box>

              <Divider className="my-3" />

              <Box className="flex justify-between font-semibold">
                <Typography>Total</Typography>
                <Typography>AED {total.toFixed(2)}</Typography>
              </Box>
            </Box>
            <Button
              variant="contained"
              fullWidth
              size="large"
              sx={{
                backgroundColor: paymentMethod ? "rgb(245,89,5)" : "gray",
                borderRadius: "8px",
              }}
              onClick={handlePlaceOrder}
              disabled={!paymentMethod}
            >
              Place Order
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
}
