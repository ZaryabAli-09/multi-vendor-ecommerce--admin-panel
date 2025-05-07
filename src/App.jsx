import React from "react";
import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Login from "./pages/Auth/Login";
import DashboardHome from "./pages/Dashboard/DashboardHome";
import AuthenticatedRoutes from "./components/RoutesWrappers/AuthenticatedRoutes";
import AdminGateway from "./pages/Auth/AdminGatewayPage";
import ProductDetail from "./pages/Dashboard/ProductManagement/Product";

const App = () => {
  return (
    <>
      <Toaster position="bottom-center" reverseOrder={true} />
      <Routes>
        {/* Auth Routes  */}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<AdminGateway />} />

        {/* Dashboard Routes  */}
        <Route element={<AuthenticatedRoutes />}>
          <Route path="/dashboard" element={<DashboardHome />} />
          <Route
            path="/dashboard/product/:productId"
            element={<ProductDetail />}
          />
        </Route>
      </Routes>
    </>
  );
};

export default App;
