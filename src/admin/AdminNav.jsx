import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { IconButton } from "@mui/material";
import LogoutConfirmPopup from "../components/logout";
import { useAuth } from "../context/auth-context";

const AdminNav = () => {
  const [logoutPopupOpen, setLogoutPopupOpen] = useState(false);
  const { authUser } = useAuth();

  const handleProfileClick = () => {
    if (authUser) setLogoutPopupOpen(true);
  };

  return (
    <>
      <nav className="bg-[rgb(244,237,227)] p-5 flex justify-between items-center border-b border-gray-300">
        {/* LEFT - LOGO */}
        <div>
          <Link to="/admin">
            <img
              src="https://www.talabat.com/assets/images/remix-logo.svg"
              alt="Logo"
              className="w-[130px]"
            />
          </Link>
        </div>

        {/* CENTER - ADMIN LINKS */}
        <ul className="flex gap-8 font-medium text-[17px]">
          <li>
            <Link
              to="/admin/restaurants"
              className="hover:text-orange-600 transition"
            >
              Restaurants
            </Link>
          </li>

          <li>
            <Link to="/admin/orders" className="px-4 py-2">
              Orders
            </Link>
          </li>
        </ul>

        {/* RIGHT - PROFILE */}
        <div>
          <IconButton
            onClick={handleProfileClick}
            size="large"
            sx={{ color: "rgb(245,89,5)" }}
          >
            <AccountCircleIcon fontSize="large" />
          </IconButton>
        </div>
      </nav>

      {/* Logout Popup */}
      <LogoutConfirmPopup
        open={logoutPopupOpen}
        onClose={() => setLogoutPopupOpen(false)}
      />
    </>
  );
};

export default AdminNav;
