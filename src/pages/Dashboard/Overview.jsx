import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Alert,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from "recharts";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];

const SellerDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch data from the backend
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${
            import.meta.env.VITE_API_URL
          }/seller/dashboard-information/674a1d35b7c4360c86e36baa`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const result = await response.json();
        console.log(result);
        setData(result);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!data) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
        <Alert severity="info">No data available</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1, padding: 3, backgroundColor: "#f5f5f5" }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ fontWeight: "bold", color: "#333" }}
      >
        Seller Dashboard
      </Typography>

      {/* Key Metrics Cards */}
      <Grid container spacing={3} sx={{ marginBottom: 4 }}>
        {[
          {
            title: "Total Revenue",
            value: `$${data.totalSellerSales}`,
            color: "#0088FE",
          },
          {
            title: "Average Order Value",
            value: `$${(data.totalSellerSales / data.totalSellerOrders).toFixed(
              2
            )}`,
            color: "#00C49F",
          },
          {
            title: "Total Orders",
            value: data.totalSellerOrders,
            color: "#FFBB28",
          },
          {
            title: "Total Products",
            value: data.totalSellerProduct,
            color: "#FF8042",
          },
          {
            title: "Total Customers",
            value: data.totalSellerCustomers,
            color: "#AF19FF",
          },
        ].map((metric, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Paper
              sx={{
                padding: 3,
                textAlign: "center",
                backgroundColor: metric.color,
                color: "#fff",
                borderRadius: 2,
                boxShadow: 3,
                height: "100%", // Ensure all cards have the same height
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                {metric.title}
              </Typography>
              <Typography variant="h4" sx={{ mt: 1 }}>
                {metric.value}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Sales Overview */}
      <Typography
        variant="h5"
        gutterBottom
        sx={{ marginTop: 3, fontWeight: "bold", color: "#333" }}
      >
        Sales Overview
      </Typography>
      <Paper
        sx={{ padding: 2, marginBottom: 4, borderRadius: 2, boxShadow: 3 }}
      >
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data.salesDataArray}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="sales" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </Paper>

      {/* Product Performance */}
      <Typography
        variant="h5"
        gutterBottom
        sx={{ marginTop: 3, fontWeight: "bold", color: "#333" }}
      >
        Top Selling Products
      </Typography>
      <Paper
        sx={{ padding: 2, marginBottom: 4, borderRadius: 2, boxShadow: 3 }}
      >
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.productDataArray}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="sales" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </Paper>

      {/* Customer Insights */}
      <Typography
        variant="h5"
        gutterBottom
        sx={{ marginTop: 3, fontWeight: "bold", color: "#333" }}
      >
        Product Category Insights
      </Typography>
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" }, // Stack vertically on small screens, side by side on medium and larger screens
          gap: 4, // Add spacing between the two charts
          marginBottom: 4,
        }}
      >
        {/* Product Sales Category Demographics */}
        <Paper
          sx={{
            padding: 2,
            borderRadius: 2,
            boxShadow: 3,
            flex: 1, // Take up equal space
          }}
        >
          <Typography
            variant="h6"
            gutterBottom
            sx={{ fontWeight: "bold", color: "#333", textAlign: "center" }}
          >
            Sales by Product Category
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.productCategoryDataArray}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={false} // Disable labels
              >
                {data.productCategoryDataArray.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Paper>

        {/* Total Product Category Demographics */}
        <Paper
          sx={{
            padding: 2,
            borderRadius: 2,
            boxShadow: 3,
            flex: 1, // Take up equal space
          }}
        >
          <Typography
            variant="h6"
            gutterBottom
            sx={{ fontWeight: "bold", color: "#333", textAlign: "center" }}
          >
            Product Distribution by Category
          </Typography>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={data.totalSellerProductCategories}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={false} // Disable labels
              >
                {data.totalSellerProductCategories.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Paper>
      </Box>

      {/* Order Status */}
      <Typography
        variant="h5"
        gutterBottom
        sx={{ marginTop: 3, fontWeight: "bold", color: "#333" }}
      >
        Order Status
      </Typography>
      <Paper
        sx={{ padding: 2, marginBottom: 4, borderRadius: 2, boxShadow: 3 }}
      >
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.orderStatusDataArray}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8" />
          </BarChart>
        </ResponsiveContainer>
      </Paper>
    </Box>
  );
};

export default SellerDashboard;
