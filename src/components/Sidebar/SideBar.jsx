import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Box,
  CircularProgress,
} from "@mui/material";
import {
  HiOutlineMenu,
  HiOutlineLogout,
  HiOutlineCog,
  HiOutlineQuestionMarkCircle,
  HiOutlineShoppingCart,
  HiOutlineCube,
  HiOutlineViewGrid,
} from "react-icons/hi";
import { MdAdminPanelSettings } from "react-icons/md";

import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/authReducers";

const DASHBOARD_SIDEBAR_LINKS = [
  {
    label: "App Insights",
    path: "/dashboard?tab=overview",
    icon: <HiOutlineViewGrid />,
  },
  {
    label: "Categories",
    path: "/dashboard?tab=add-categories",
    icon: <HiOutlineCube />,
  },

  {
    label: "Products",
    path: "/dashboard?tab=products",
    icon: <HiOutlineCube />,
  },
  {
    label: "Orders",
    path: "/dashboard?tab=orders",
    icon: <HiOutlineShoppingCart />,
  },
  {
    label: "Reviews",
    path: "/dashboard?tab=reviews",
    icon: <HiOutlineShoppingCart />,
  },
];

const DASHBOARD_SIDEBAR_BOTTOM_LINKS = [
  {
    label: "Settings",
    path: "/dashboard?tab=settings",
    icon: <HiOutlineCog />,
  },
  {
    label: "Admins Management",
    path: "/dashboard?tab=admin-management",
    icon: <HiOutlineCog />,
  },

  {
    label: "Store Billing Info",
    path: "/dashboard?tab=billing",
    icon: <HiOutlineCog />,
  },
  {
    label: "Seller Requests",
    path: "/dashboard?tab=seller-requests",
    icon: <HiOutlineQuestionMarkCircle />,
  },
  {
    label: "Support & Disputes",
    path: "/support",
    icon: <HiOutlineQuestionMarkCircle />,
  },
];

const Sidebar = ({ activeTab }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { loading } = useSelector((state) => state.auth);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleLogout = async () => {
    dispatch(logout());
    navigate("/login");
  };

  const toggleDrawer = () => {
    setMobileOpen(!mobileOpen);
  };

  const sidebarContent = (
    <Box className="w-60 bg-secondary text-primary-base h-full p-4 flex flex-col">
      <div className="flex items-center gap-2 mb-6">
        <MdAdminPanelSettings fontSize={24} />
        <span className="font-bold text-sm">LOGO ADMIN PANEL</span>
      </div>
      <List>
        {DASHBOARD_SIDEBAR_LINKS.map((link) => (
          <ListItem key={link.label} disablePadding>
            <ListItemButton
              component={Link}
              to={link.path}
              className={`rounded  ${
                activeTab === link.path ? "bg-gray-300" : "hover:bg-primary"
              }`}
            >
              <ListItemIcon>{link.icon}</ListItemIcon>
              <ListItemText primary={link.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <List className="mt-auto border-t pt-2">
        {DASHBOARD_SIDEBAR_BOTTOM_LINKS.map((link) => (
          <ListItem key={link.label} disablePadding>
            <ListItemButton
              component={Link}
              to={link.path}
              className={`rounded ${
                activeTab === link.path ? "bg-gray-300" : "hover:bg-primary"
              }`}
            >
              <ListItemIcon>{link.icon}</ListItemIcon>
              <ListItemText primary={link.label} />
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem disablePadding>
          <ListItemButton className="text-red-500 hover:bg-primary rounded">
            <ListItemIcon>
              <HiOutlineLogout />
            </ListItemIcon>
            {loading ? (
              <CircularProgress size={24} />
            ) : (
              <ListItemText onClick={handleLogout} primary="Logout" />
            )}
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="md:hidden p-2 border">
        <IconButton onClick={toggleDrawer}>
          <HiOutlineMenu className="text-black" />
        </IconButton>
      </div>

      {/* Sidebar for Desktop */}
      <div className="hidden md:flex border-r w-64 fixed overflow-y-auto bg-secondary h-full">
        {sidebarContent}
      </div>

      {/* Sidebar for Mobile */}
      <Drawer anchor={"left"} open={mobileOpen} onClose={toggleDrawer}>
        {sidebarContent}
      </Drawer>
    </>
  );
};

export default Sidebar;
