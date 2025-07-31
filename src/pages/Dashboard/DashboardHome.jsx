import React, { useEffect, useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Sidebar from "../../components/Sidebar/SideBar";
import { useLocation } from "react-router-dom";
import Overview from "./Overview";
import AllProducts from "./ProductManagement/AllProducts";
import Orders from "./Orders";
import Billing from "./Billing";
import Settings from "./Settings";
import Reviews from "./ReviewsManagement/Reviews";
import AddCategories from "./AddCategories";
import AdminSettings from "./AdminManagement";
import SellerRequests from "./SellerRequests";
import SupprtAndDisputes from "./SupportAndDisputes";
import BrandsManagement from "./BrandsManagement";
import AdminReels from "./Reels";

const DashboardHome = () => {
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [tab, setTab] = useState("overview");
  const fullUrl = location.pathname + location.search;
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tabFromUrl = urlParams.get("tab");
    if (tabFromUrl) {
      setTab(tabFromUrl);
    }
  }, [location.search]);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <Sidebar
        activeTab={fullUrl}
        isOpen={isSidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      {/* Content Area */}
      <div className="flex flex-col w-full md:ml-[256px]   overflow-auto">
        <Navbar />
        <div className="p-4">
          {tab === "overview" && <Overview />}
          {tab === "add-categories" && <AddCategories />}

          {tab === "products" && <AllProducts />}
          {tab === "orders" && <Orders />}
          {tab === "reviews" && <Reviews />}
          {tab === "settings" && <Settings />}
          {tab === "billing" && <Billing />}
          {tab === "admin-management" && <AdminSettings />}
          {tab === "seller-requests" && <SellerRequests />}
          {tab === "support" && <SupprtAndDisputes />}
          {tab === "brands" && <BrandsManagement />}
          {tab === "reels" && <AdminReels />}
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
