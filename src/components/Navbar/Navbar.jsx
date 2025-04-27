import React, { useState } from "react";
import { AiFillProfile, AiOutlineLogout } from "react-icons/ai";
import {
  Button,
  Menu,
  MenuItem,
  CircularProgress,
  IconButton,
  Avatar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/authReducers";

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

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
    <nav className="bg-white border-b px-4 py-2 flex justify-end items-center">
      <div>
        {/* Profile Icon Button */}
        <IconButton
          onClick={handleMenuOpen}
          className="h-10 w-10 rounded-full"
          aria-controls="profile-menu"
          aria-haspopup="true"
        >
          <Avatar className="text-2xl " />
        </IconButton>

        {/* Dropdown Menu */}
        <Menu
          id="profile-menu"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          className="mt-2"
          PaperProps={{
            className: "w-48 rounded-lg shadow-lg",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          TransitionProps={{
            timeout: 150,
            enter: true,
            exit: true,
          }}
        >
          {/* Logout Button */}
          <MenuItem
            onClick={handleLogout}
            className="text-gray-700 hover:bg-gray-100"
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={20} className="mr-2" />
            ) : (
              <AiOutlineLogout className="mr-2" />
            )}
            Logout
          </MenuItem>
        </Menu>
      </div>
    </nav>
  );
};

export default Navbar;
