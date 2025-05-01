import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Skeleton,
  MenuItem,
  Select,
  TextField,
  Box,
  Typography,
  Pagination,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import OrderDetailsModal from "../../components/Order/OrderDetailsModal ";
import { FaEye } from "react-icons/fa";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [isFetching, setIsFetching] = useState(true); // For initial data fetch skeleton
  const [updatingStatus, setUpdatingStatus] = useState(false); // For status update loader
  const [filters, setFilters] = useState({
    status: "",
    orderId: "",
    dateFilter: "",
  });
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const [totalPages, setTotalPages] = useState(1); // Total number of pages
  const limit = 10; // Orders per page

  // Fetch all orders
  const fetchOrders = async (page, filters = {}) => {
    try {
      setIsFetching(true); // Show skeleton while fetching data

      // Build query parameters
      const queryParams = new URLSearchParams({
        page,
        limit,
        ...filters,
      }).toString();

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/order/all?${queryParams}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );
      const result = await res.json();
      if (!res.ok) {
        toast.error(result.message);
      } else {
        setOrders(result.data.data); // Update orders
        const totalPages = Math.ceil(result.data.total / limit); // Calculate total pages
        setTotalPages(totalPages);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsFetching(false); // Hide skeleton after data is fetched
    }
  };

  // Handle status change for an order
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      setUpdatingStatus(true); // Show loader on status change
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/order/update-status-admin/${orderId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ status: newStatus }),
        }
      );
      const result = await res.json();
      if (!res.ok) {
        toast.error(result.message);
      } else {
        // Update the status in the local state
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order._id === orderId ? { ...order, status: newStatus } : order
          )
        );
        toast.success(result.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setUpdatingStatus(false); // Hide loader after API call
    }
  };

  // Handle viewing order details
  const handleViewDetails = (orderId) => {
    setSelectedOrderId(orderId);
    setDetailsModalOpen(true);
  };

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Apply filters
  const applyFilters = () => {
    setCurrentPage(1); // Reset to the first page
    fetchOrders(1, filters);
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      status: "",
      orderId: "",
      dateFilter: "",
    });
    setCurrentPage(1); // Reset to the first page
    fetchOrders(1);
  };

  // Handle page change
  const handlePageChange = (event, page) => {
    setCurrentPage(page);
    fetchOrders(page, filters);
  };

  useEffect(() => {
    fetchOrders(currentPage, filters);
  }, [currentPage]);

  return (
    <>
      {/* Sticky Filter Section */}
      <Box
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          backgroundColor: "white",
          padding: 2,
          boxShadow: 3,
          marginBottom: 4,
        }}
      >
        <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
          Filters
        </Typography>
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            alignItems: "center",
          }}
        >
          <TextField
            label="Order ID"
            name="orderId"
            value={filters.orderId}
            onChange={handleFilterChange}
            size="small"
          />
          <Select
            label="Status"
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            size="small"
            displayEmpty
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="pending">Pending</MenuItem>
            <MenuItem value="shipped">Shipped</MenuItem>
            <MenuItem value="delivered">Delivered</MenuItem>
            <MenuItem value="canceled">Canceled</MenuItem>
          </Select>
          <Select
            label="Date Filter"
            name="dateFilter"
            value={filters.dateFilter}
            onChange={handleFilterChange}
            size="small"
            displayEmpty
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="thisWeek">This Week</MenuItem>
            <MenuItem value="thisMonth">This Month</MenuItem>
            <MenuItem value="lastMonth">Last Month</MenuItem>
          </Select>
          <Button variant="contained" onClick={applyFilters}>
            Apply Filters
          </Button>
          <Button variant="outlined" onClick={clearFilters}>
            Clear Filters
          </Button>
        </Box>
      </Box>

      <TableContainer className="p-4" component={Paper}>
        <h2 className="text-xl md:text-2xl mb-6">Manage Orders</h2>

        <Table>
          <TableHead className="bg-gray-100">
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Order ID</TableCell>
              <TableCell>Customer</TableCell>
              <TableCell>Customer Email</TableCell>
              <TableCell>Brand/Store</TableCell>
              <TableCell>Total Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isFetching ? (
              // Skeleton Loading
              Array.from({ length: limit }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton variant="text" />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="rectangular" width={100} height={40} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="rectangular" width={100} height={40} />
                  </TableCell>
                </TableRow>
              ))
            ) : !orders || orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center">
                  No orders found.
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order, index) => (
                <TableRow key={order._id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{order._id}</TableCell>
                  <TableCell>{order.orderBy?.name}</TableCell>
                  <TableCell>{order.orderBy?.email}</TableCell>
                  <TableCell>{order.seller?.brandName}</TableCell>

                  <TableCell>Rs.{order.totalAmount}</TableCell>
                  <TableCell>
                    <Select
                      value={order.status}
                      onChange={(e) =>
                        handleStatusChange(order._id, e.target.value)
                      }
                      disabled={updatingStatus}
                      size="small"
                    >
                      <MenuItem value="pending">Pending</MenuItem>
                      <MenuItem value="shipped">Shipped</MenuItem>
                      <MenuItem value="delivered">Delivered</MenuItem>
                      <MenuItem value="canceled">Canceled</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Button
                      onClick={() => handleViewDetails(order._id)}
                      variant="contained"
                      color="primary"
                      size="small"
                    >
                      <FaEye className="text-xl" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {!isFetching && totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
          />
        </Box>
      )}

      {/* Order Details Modal */}
      <OrderDetailsModal
        open={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        orderId={selectedOrderId}
      />
    </>
  );
};

export default Orders;
