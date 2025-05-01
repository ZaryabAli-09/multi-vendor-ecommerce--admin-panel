import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  CircularProgress,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Avatar,
  Card,
  CardContent,
  Divider,
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
  AreaChart,
  Area,
} from "recharts";

import StarIcon from "@mui/icons-material/Star";
import BusinessIcon from "@mui/icons-material/Business";
import InventoryIcon from "@mui/icons-material/Inventory";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#AF19FF",
  "#FF4560",
  "#775DD0",
];

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dateRange, setDateRange] = useState({
    start: null,
    end: null,
  });

  useEffect(() => {
    fetchDashboardData();
  }, [dateRange]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      let url = `${import.meta.env.VITE_API_URL}/admin/app-insights`;

      // Add date range if specified
      const params = new URLSearchParams();
      if (dateRange.start)
        params.append("startDate", dateRange.start.toISOString());
      if (dateRange.end) params.append("endDate", dateRange.end.toISOString());

      if (params.toString()) url += `?${params.toString()}`;

      const response = await fetch(url);
      if (!response.ok) throw new Error("Failed to fetch data");

      const result = await response.json();
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

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
      <h2 className="text-xl md:text-4xl mb-10"> Admin Dashboard Overview</h2>

      {/* Key Metrics Cards */}
      <Grid container spacing={3} sx={{ marginBottom: 4 }}>
        {[
          {
            title: "Total Revenue",
            value: `Rs. ${data.totalRevenue.toLocaleString()}`,
            change: "+12%",
            color: "#0088FE",
            icon: "💰",
          },
          {
            title: "Total Orders",
            value: data.totalOrders.toLocaleString(),
            change: "+5%",
            color: "#00C49F",
            icon: "📦",
          },
          {
            title: "Total Products",
            value: data.totalProducts.toLocaleString(),
            change: "+3%",
            color: "#FFBB28",
            icon: "🛍️",
          },
          {
            title: "Total Customers",
            value: data.totalCustomers.toLocaleString(),
            change: "+8%",
            color: "#FF8042",
            icon: "👥",
          },
          {
            title: "Avg. Order Value",
            value: `Rs. ${(data.totalRevenue / data.totalOrders).toFixed(0)}`,
            change: "+4%",
            color: "#AF19FF",
            icon: "💳",
          },
        ].map((metric, index) => (
          <Grid item xs={12} sm={6} md={4} lg={2.4} key={index}>
            <Card
              sx={{
                height: "100%",
                backgroundColor: metric.color,
                color: "#fff",
                borderRadius: 2,
                boxShadow: 3,
              }}
            >
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                    {metric.title}
                  </Typography>
                  <Typography variant="h5">{metric.icon}</Typography>
                </Box>
                <Typography variant="h4" sx={{ mt: 1 }}>
                  {metric.value}
                </Typography>
                <Chip
                  label={metric.change}
                  size="small"
                  sx={{
                    mt: 1,
                    backgroundColor: "rgba(255,255,255,0.2)",
                    color: "#fff",
                  }}
                />
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Revenue Chart - Monthly Only */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12}>
          <Paper
            sx={{
              p: 2,
              borderRadius: 2,
              boxShadow: 3,
              height: "100%",
              width: "100%",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              Monthly Revenue (PKR)
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data.revenueData.monthly}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="period" />
                <YAxis
                  width={100} // Increased from default ~60px
                  tick={{
                    fontSize: 11, // Smaller text size
                    fontFamily: "inherit", // Match your app's font
                    fill: "#555", // Darker gray for better readability
                  }}
                  tickFormatter={(value) => `PKR ${value.toLocaleString()}`}
                  tickMargin={10} // Additional spacing
                />
                <Tooltip
                  formatter={(value) => [
                    `PKR ${value.toLocaleString()}`,
                    "Revenue",
                  ]}
                  labelFormatter={(label) => `Month: ${label}`}
                />
                <Bar
                  dataKey="amount"
                  fill="#8884d8"
                  radius={[4, 4, 0, 0]}
                  name="Revenue"
                />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Product Distribution */}
      <h2 className="text-xl md:text-2xl mb-5 ml-5"> Product Analytics</h2>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Product Distribution by Category */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 3, height: "100%" }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              Product Distribution by Category
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.productDistributionByCategory}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={40} // Adds a donut hole for better aesthetics
                  fill="#8884d8"
                  dataKey="productCount"
                  label={({ productCount }) => productCount} // Shows just the count number
                  labelLine={false} // Removes connecting lines
                  // Custom label styling
                  labelStyle={{
                    fontSize: "12px",
                    fontWeight: "bold",
                    fill: "#333",
                  }}
                >
                  {data.productDistributionByCategory.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                      stroke="#fff" // Adds white border between segments
                      strokeWidth={1}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name, props) => [
                    `${value} products`,
                    props.payload.category, // Shows the full category name on hover
                  ]}
                  contentStyle={{
                    borderRadius: "8px",
                    boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
                    border: "none",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Sales by Product Category */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 3, height: "100%" }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              Sales by Product Category
            </Typography>
            <ResponsiveContainer width="100%" height={400}>
              <BarChart
                data={data.productSalesByCategory}
                layout="vertical"
                margin={{ top: 20, right: 20, left: 100, bottom: 20 }} // Adjusted margins
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  type="number"
                  tick={{ fontSize: 11 }}
                  tickFormatter={(value) => `${value}`} // Plain number display
                />
                <YAxis
                  dataKey="name" // Changed from "category" to match your data structure
                  type="category"
                  width={150} // Increased for longer category names
                  tick={{
                    fontSize: 11,
                    fontWeight: 500,
                    fontFamily: "inherit",
                  }}
                />
                <Tooltip
                  formatter={(value) => [`${value} sold`, "Quantity"]}
                  labelFormatter={(label) => `Category: ${label}`}
                  contentStyle={{
                    borderRadius: 6,
                    padding: "8px 12px",
                    fontSize: 12,
                    border: "none",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                  }}
                />
                <Bar
                  dataKey="value" // Changed from "totalSales" to match your data
                  name="Products Sold"
                  fill="#8884d8"
                  radius={[0, 4, 4, 0]}
                >
                  {data.productSalesByCategory.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Top Selling Products */}
      <Paper
        sx={{
          p: 2,
          mb: 4,
          borderRadius: 2,
          boxShadow: 3,
          height: "500px", // Fixed height
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Typography
          variant="h5"
          sx={{
            fontWeight: "bold",
            mb: 2,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <StarIcon color="primary" /> {/* Added icon */}
          Top Selling Products
        </Typography>

        <TableContainer
          sx={{
            flex: 1,
            overflow: "auto",
            "&::-webkit-scrollbar": {
              width: "6px",
            },
            "&::-webkit-scrollbar-thumb": {
              backgroundColor: "#8884d8",
              borderRadius: "3px",
            },
          }}
        >
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: "bold" }}>Product</TableCell>
                <TableCell sx={{ fontWeight: "bold" }}>Brand</TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                  Units Sold
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>
                  Revenue
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.topSellingProducts.map((product) => (
                <TableRow
                  key={product.id}
                  hover
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar
                        src={product.image}
                        alt={product.name}
                        sx={{
                          width: 56,
                          height: 56,
                          borderRadius: "8px",
                        }}
                        variant="rounded"
                      />
                      <Typography variant="body1" noWrap>
                        {product.name}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Chip
                      icon={<BusinessIcon fontSize="small" />}
                      label={product.brand}
                      sx={{
                        backgroundColor: "rgba(255, 214, 0, 0.2)",
                        color: "text.primary",
                        fontWeight: "medium",
                      }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                      }}
                    >
                      <Typography sx={{ mr: 1 }}>{product.sold}</Typography>
                      <InventoryIcon fontSize="small" color="action" />
                    </Box>
                  </TableCell>
                  <TableCell align="right">
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "flex-end",
                      }}
                    >
                      <Typography sx={{ mr: 1, fontWeight: "medium" }}>
                        Rs. {product.revenue.toLocaleString()}
                      </Typography>
                      <AttachMoneyIcon fontSize="small" color="success" />
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
      {/* Customer Insights */}
      <h2 className="text-xl md:text-2xl mb-5 ml-5"> Customer Insights</h2>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Customer Acquisition */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 3, height: "100%" }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              Customer Acquisition
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.customerAcquisition}>
                <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="newCustomers"
                  stroke="#FF8042"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Customer Value */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, borderRadius: 2, boxShadow: 3, height: "100%" }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", mb: 2 }}>
              Top Customers by Value
            </Typography>
            <TableContainer>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell>Customer</TableCell>
                    <TableCell align="right">Orders</TableCell>
                    <TableCell align="right">Total Spent</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.customerData.customerDetails
                    .sort((a, b) => b.totalSpent - a.totalSpent)
                    .slice(0, 5)
                    .map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center" }}>
                            <Avatar sx={{ mr: 2, bgcolor: COLORS[1] }}>
                              {customer.name.charAt(0)}
                            </Avatar>
                            <Box>
                              <Typography>{customer.name}</Typography>
                              <Typography
                                variant="body2"
                                color="text.secondary"
                              >
                                {customer.email}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell align="right">
                          {customer.orderCount}
                        </TableCell>
                        <TableCell align="right">
                          Rs. {customer.totalSpent.toLocaleString()}
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* Order Status */}
      <Paper sx={{ p: 2, mb: 4, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: "bold", mb: 2 }}>
          Order Status Overview
        </Typography>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.orderStatusData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  label={({ status, percent }) =>
                    `${status}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {data.orderStatusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Grid>
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                justifyContent: "center",
              }}
            >
              {data.orderStatusData.map((status, index) => (
                <Box key={status.status} sx={{ mb: 2 }}>
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      mb: 1,
                    }}
                  >
                    <Typography>
                      <Chip
                        label={status.status}
                        size="small"
                        sx={{
                          backgroundColor: COLORS[index],
                          color: "#fff",
                          mr: 1,
                        }}
                      />
                    </Typography>
                    <Typography>{status.count} orders</Typography>
                  </Box>
                  <Box sx={{ width: "100%", bgcolor: "#eee", borderRadius: 4 }}>
                    <Box
                      sx={{
                        width: `${(status.count / data.totalOrders) * 100}%`,
                        height: 8,
                        bgcolor: COLORS[index],
                        borderRadius: 4,
                      }}
                    />
                  </Box>
                </Box>
              ))}
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default AdminDashboard;
