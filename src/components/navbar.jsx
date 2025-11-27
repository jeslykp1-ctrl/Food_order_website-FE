import { useState } from "react";
import { Link } from "react-router-dom";
import { IconButton } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useCart } from "../context/cart-context";
import { useAuth } from "../context/auth-context";
import LogoutConfirmPopup from "../components/logout";
export default function Navbar() {
  const { cartCount } = useCart();
  u;
  const [logoutPopupOpen, setLogoutPopupOpen] = useState(false);
  const { authUser } = useAuth();

  const handleProfileClick = () => {
    if (authUser) setLogoutPopupOpen(true);
  };
  return (
    <>
      <nav className="bg-[rgb(244,237,227)] p-5 flex justify-between items-center">
        <div>
          <Link to="/">
            <img
              src="https://www.talabat.com/assets/images/remix-logo.svg"
              alt="TalabatClone Logo"
              className="w-[130px]"
            />
          </Link>
        </div>
        <div>
          <IconButton>
            <img
              src="https://www.talabat.com/assets/images/ar.svg"
              alt="ar"
            ></img>
          </IconButton>

          <IconButton
            onClick={handleProfileClick}
            size="large"
            sx={{ color: "rgb(245,89,5)" }}
          >
            <AccountCircleIcon fontSize="large" />
          </IconButton>
          <Link to="/order-summary" className="relative">
            <IconButton sx={{ backgroundColor: "white" }}>
              <img
                src="https://www.talabat.com/assets/images/new_cart_icn.png"
                alt="cart"
                className="h-6"
              />
            </IconButton>
            {cartCount > 0 && authUser && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </nav>
{/* 
      {loginPopupOpen && (
        <ProfilePopup
          open={loginPopupOpen}
          onClose={() => setLoginPopupOpen(false)}
        />
      )} */}
      <LogoutConfirmPopup
        open={logoutPopupOpen}
        onClose={() => setLogoutPopupOpen(false)}
      />
    </>
  );
}
