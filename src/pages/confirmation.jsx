import { useEffect } from "react";
import { Box, Card, CardContent, Typography, Button } from "@mui/material";
import { Link } from "react-router-dom";
import { useCart } from "../context/cart-context";
import client from "../api/client";

export default function Confirmation() {
  const clearCart = useCart().clearCart; // frontend clear (optional)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const sessionId = params.get("session_id");
    console.log(sessionId, "====id");
    if (sessionId) {
      clearCart();
      client.get(`api/payment/verify-checkout-session`).then((res) => {
        if (res.data.payment_status === "paid") {
          clearCart(); // CLEAR FRONTEND CONTEXT
        }
      });
    }
  }, []);

  return (
    <Box className="min-h-screen bg-gray-100 p-4 md:p-6 flex flex-col gap-4 md:gap-6 lg:px-[10%] xl:px-[20%]">
      <Card className="shadow-lg border border-gray-200 rounded-lg">
        <CardContent className="p-4 md:p-6 flex flex-col items-center gap-6">
          <Typography
            variant="h4"
            className="font-semibold text-center text-orange-600"
          >
            Order Confirmed!
          </Typography>

          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-green-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>

          <Typography className="text-center text-gray-700">
            Your order has been placed successfully. You'll receive a
            confirmation shortly.
          </Typography>

          <Link to="/" className="w-full md:w-1/2">
            <Button
              variant="contained"
              fullWidth
              size="large"
              sx={{ backgroundColor: "rgb(245,89,5)", borderRadius: "8px" }}
            >
              Back to Home
            </Button>
          </Link>
        </CardContent>
      </Card>
    </Box>
  );
}
