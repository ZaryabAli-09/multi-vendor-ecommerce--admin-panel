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
  HiOutlineChartBar,
  HiOutlineCollection,
  HiOutlineUsers,
  HiOutlineCreditCard,
  HiOutlineShieldCheck,
} from "react-icons/hi";
import { MdAdminPanelSettings, MdDashboard } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../../store/authReducers";
import { CiVideoOn } from "react-icons/ci";

// ===== Updated Sidebar Links =====
const DASHBOARD_SIDEBAR_LINKS = [
  {
    label: "Dashboard",
    path: "/dashboard?tab=overview",
    icon: <MdDashboard size={18} />,
  },
  {
    label: "Brands",
    path: "/dashboard?tab=brands",
    icon: <HiOutlineShieldCheck size={18} />, // More relevant icon
  },
  {
    label: "Categories",
    path: "/dashboard?tab=add-categories",
    icon: <HiOutlineCollection size={18} />,
  },
  {
    label: "Products",
    path: "/dashboard?tab=products",
    icon: <HiOutlineCube size={18} />,
  },
  {
    label: "Reels",
    path: "/dashboard?tab=reels",
    icon: <CiVideoOn size={18} />,
  },
  {
    label: "Orders",
    path: "/dashboard?tab=orders",
    icon: <HiOutlineShoppingCart size={18} />,
  },
  {
    label: "Reviews",
    path: "/dashboard?tab=reviews",
    icon: <HiOutlineUsers size={18} />, // Represents user feedback
  },
];

const DASHBOARD_SIDEBAR_BOTTOM_LINKS = [
  {
    label: "Settings",
    path: "/dashboard?tab=settings",
    icon: <HiOutlineCog size={18} />,
  },
  {
    label: "Admins",
    path: "/dashboard?tab=admin-management",
    icon: <HiOutlineUsers size={18} />, // Consistency with "Users"
  },
  {
    label: "Billing",
    path: "/dashboard?tab=billing",
    icon: <HiOutlineCreditCard size={18} />,
  },
  {
    label: "Brands Requests",
    path: "/dashboard?tab=seller-requests",
    icon: <HiOutlineQuestionMarkCircle size={18} />,
  },
  {
    label: "Support",
    path: "/dashboard?tab=support",
    icon: <HiOutlineQuestionMarkCircle size={18} />,
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

  const toggleDrawer = () => setMobileOpen(!mobileOpen);

  // ===== Styled Sidebar Content =====
  const sidebarContent = (
    <Box className="w-64 bg-white text-gray-800 h-full p-4 flex flex-col border-r border-gray-200">
      {/* Brand Header */}
      <div className="flex items-center gap-2 mb-8 p-2">
        <MdAdminPanelSettings className="text-2xl text-black" />
        <span className="font-bold text-lg">
          {import.meta.env.VITE_PLATFORM_NAME}
        </span>
        <span className="text-xs bg-black text-white px-2 py-1 rounded ml-auto">
          ADMIN
        </span>
      </div>

      {/* Main Links */}
      <List className="space-y-1">
        {DASHBOARD_SIDEBAR_LINKS.map((link) => (
          <ListItem key={link.label} disablePadding className="mb-1">
            <ListItemButton
              component={Link}
              to={link.path}
              className={`rounded-lg px-3 py-2 ${
                activeTab === link.path
                  ? "bg-primary text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              <ListItemIcon className="min-w-[32px]">
                <span
                  className={
                    activeTab === link.path ? "text-blue-400" : "text-gray-600"
                  }
                >
                  {link.icon}
                </span>
              </ListItemIcon>
              <ListItemText
                primary={link.label}
                primaryTypographyProps={{
                  fontSize: "0.875rem",
                  fontWeight: 500,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      {/* Bottom Links (Settings/Logout) */}
      <List className="mt-auto border-t border-gray-200 pt-2 space-y-1">
        {DASHBOARD_SIDEBAR_BOTTOM_LINKS.map((link) => (
          <ListItem key={link.label} disablePadding className="mb-1">
            <ListItemButton
              component={Link}
              to={link.path}
              className={`rounded-lg px-3 py-2 ${
                activeTab === link.path
                  ? "bg-primary text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              <ListItemIcon className="min-w-[32px]">
                <span
                  className={
                    activeTab === link.path ? "text-blue-400" : "text-gray-600"
                  }
                >
                  {link.icon}
                </span>
              </ListItemIcon>
              <ListItemText
                primary={link.label}
                primaryTypographyProps={{
                  fontSize: "0.875rem",
                  fontWeight: 500,
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem disablePadding>
          <ListItemButton
            onClick={handleLogout}
            className="rounded-lg px-3 py-2 text-red-500 hover:bg-red-50"
          >
            <ListItemIcon className="min-w-[32px]">
              {loading ? (
                <CircularProgress size={20} color="error" />
              ) : (
                <HiOutlineLogout className="text-red-500" size={18} />
              )}
            </ListItemIcon>
            <ListItemText
              primary="Logout"
              primaryTypographyProps={{
                fontSize: "0.875rem",
                fontWeight: 500,
              }}
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="md:hidden p-4">
        <IconButton onClick={toggleDrawer} className="text-black">
          <HiOutlineMenu size={24} />
        </IconButton>
      </div>

      {/* Desktop Sidebar */}
      <div className="hidden md:flex fixed h-full">{sidebarContent}</div>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileOpen}
        onClose={toggleDrawer}
        PaperProps={{ style: { width: "256px" } }}
      >
        {sidebarContent}
      </Drawer>
    </>
  );
};

export default Sidebar;
