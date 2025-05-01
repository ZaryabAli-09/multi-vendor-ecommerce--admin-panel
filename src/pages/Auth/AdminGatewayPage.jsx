import React from "react";
import { AiFillAlipayCircle } from "react-icons/ai";
import { Link } from "react-router-dom";
import { Button } from "../../components/common ui comps/Button";
const AdminGateway = () => {
  return (
    <section className="bg-primary p-6 flex flex-col items-center justify-center h-[100vh] text-center">
      <div className="mb-8 flex items-center gap-2">
        <AiFillAlipayCircle className="text-4xl text-black" />
        <span className="text-2xl font-bold">LOGO</span>
      </div>
      <h1 className="text-3xl font-bold mb-4">Admin Panel</h1>
      <p className="text-slate-600 max-w-md mb-8">
        Access the dashboard to manage vendors, orders, and platform settings.
      </p>
      <Link to="/login">
        <Button className="bg-black text-white px-8 py-3 rounded-lg hover:bg-gray-800 hover:text-black transition">
          Continue to LOGO Admin
        </Button>
      </Link>
    </section>
  );
};

export default AdminGateway;
