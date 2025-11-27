import { Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import { useAuth } from "../context/auth-context";
import client from "../api/client";
import { useNavigate } from "react-router-dom";

export default function LogoutConfirmPopup({ open, onClose }) {
  const { clearAuthUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await client.delete("api/cart/clear-cart/");
      clearAuthUser();
      onClose();
      navigate("/");
    } catch (err) {
      console.error("Failed to clear cart:", err);
      clearAuthUser();
      onClose();
    }
  };
  return (
    <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle>Are you sure you want to logout?</DialogTitle>
      <DialogContent>
        <Button
          variant="contained"
          sx={{ backgroundColor: "rgb(245,89,5)", borderRadius: "8px", mt: 2 }}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </DialogContent>
    </Dialog>
  );
}
