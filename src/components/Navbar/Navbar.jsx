import React, { useState } from "react";
import { AiOutlineLogout } from "react-icons/ai";
import { HiOutlineMail } from "react-icons/hi";
import { Menu, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/authReducers";

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, user } = useSelector((state) => state.auth);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b border-gray-200 px-4 py-2 flex justify-between items-center">
      {/* Email display */}
      <div className="flex items-center gap-2 text-sm text-gray-600">
        <HiOutlineMail className="text-gray-500" />
        <span>{user?.email || "Admin"}</span>
      </div>

      {/* Avatar and dropdown */}
      <div className="relative">
        <button
          onClick={handleMenuOpen}
          className="flex items-center justify-center w-8 h-8 rounded-full focus:outline-none"
        >
          <div className="w-8 h-8 rounded-full bg-black flex items-center justify-center text-white text-sm font-medium">
            {user?.email?.charAt(0).toUpperCase() || "A"}
          </div>
        </button>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          className="mt-1"
          PaperProps={{
            className:
              "min-w-[120px] rounded-lg shadow-md border border-gray-200",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
        >
          <MenuItem
            onClick={handleLogout}
            className="text-sm py-1.5 px-3 text-gray-700 hover:bg-gray-100"
            disabled={loading}
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-gray-400 border-t-black rounded-full animate-spin" />
                <span>Logging out</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <AiOutlineLogout className="text-gray-600" />
                <span>Logout</span>
              </div>
            )}
          </MenuItem>
        </Menu>
      </div>
    </nav>
  );
};

export default Navbar;
