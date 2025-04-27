import {
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  Button,
  TableHead,
  TableRow,
  Paper,
  Collapse,
  Box,
  Modal,
  TextField,
  Select,
  MenuItem,
  Typography,
  Pagination,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import StarRating from "../../../components/common ui comps/StarRating";

const Reviews = () => {
  const [isFetching, setIsFetching] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});
  const [filters, setFilters] = useState({
    replyStatus: "",
    productName: "",
    dateFilter: "",
  });
  const [currentPage, setCurrentPage] = useState(1); // Current page number
  const [totalPages, setTotalPages] = useState(1); // Total number of pages
  const [noReviewsMessage, setNoReviewsMessage] = useState(""); // Message for no reviews
  const limit = 10; // Reviews per page

  // Fetch all reviews for the seller
  const fetchReviews = async (page, filters = {}) => {
    try {
      setIsFetching(true); // Show skeleton while fetching data
      setNoReviewsMessage(""); // Reset no reviews message

      // Build query parameters
      const queryParams = new URLSearchParams({
        page,
        limit,
        ...filters,
      }).toString();

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/product/review/all?${queryParams}`,
        {
          credentials: "include",
        }
      );
      const result = await res.json();
      console.log(result);
      if (!res.ok) {
        toast.error(result.message);
      } else {
        if (result.data.length === 0) {
          setNoReviewsMessage(result.message || "No reviews found."); // Set no reviews message
        } else {
          setReviews(result.data.data); // Update reviews

          const totalPages = Math.ceil(result.data.total / limit); // Calculate total pages
          setTotalPages(totalPages);
        }
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsFetching(false); // Hide skeleton after data is fetched
    }
  };

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Apply filters
  const applyFilters = () => {
    setCurrentPage(1); // Reset to the first page
    fetchReviews(1, filters);
  };

  // Clear filters
  const clearFilters = () => {
    setFilters({
      replyStatus: "",
      productName: "",
      dateFilter: "",
    });
    setCurrentPage(1); // Reset to the first page
    fetchReviews(1);
  };

  // Handle page change
  const handlePageChange = (event, page) => {
    setCurrentPage(page);
    fetchReviews(page, filters);
  };

  // Handle viewing order details
  const toggleExpand = (id) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  useEffect(() => {
    fetchReviews(currentPage, filters);
  }, [currentPage]);

  return (
    <div>
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
          <Select
            label="Reply Status"
            name="replyStatus"
            value={filters.replyStatus}
            onChange={handleFilterChange}
            size="small"
            displayEmpty
          >
            <MenuItem value="">All</MenuItem>
            <MenuItem value="replied">Replied</MenuItem>
            <MenuItem value="not replied">Not Replied</MenuItem>
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
        <h2 className="text-xl md:text-2xl mb-6">Manage your Reviews</h2>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Review User</TableCell>
              <TableCell>Product</TableCell>
              <TableCell>Brand/store</TableCell>
              <TableCell>Rating</TableCell>
              <TableCell>Reply Status</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {isFetching ? (
              <TableRow>
                {[...Array(4)].map((_, index) => (
                  <TableCell key={index}>
                    <Skeleton variant="text" />
                  </TableCell>
                ))}
              </TableRow>
            ) : noReviewsMessage ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center">
                  <Typography variant="body1" color="textSecondary">
                    {noReviewsMessage}
                  </Typography>
                </TableCell>
              </TableRow>
            ) : (
              reviews.map((review, i) => {
                const hasReply = review.sellerReply?.text;
                return (
                  <React.Fragment key={review._id}>
                    <TableRow>
                      <TableCell>{i + 1}</TableCell>
                      <TableCell>{review.user?.name}</TableCell>
                      <TableCell>{review.product?.name}</TableCell>
                      <TableCell>{review.product?.seller?.brandName}</TableCell>

                      <TableCell>
                        <StarRating rating={review.rating} />
                      </TableCell>
                      <TableCell>
                        {hasReply ? (
                          <span className="bg-green-500 rounded-md font-semibold text-sm text-white p-2">
                            Replied
                          </span>
                        ) : (
                          <span className="bg-yellow-500 text-xs line-clamp-none rounded-md font-semibold md:text-sm text-white p-2">
                            Not Replied
                          </span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => toggleExpand(review._id)}
                        >
                          {expandedRows[review._id] ? "Collapse" : "Expand"}
                        </Button>
                      </TableCell>
                    </TableRow>

                    {/* Expanded Row */}
                    <TableRow>
                      <TableCell colSpan={6} style={{ padding: 0 }}>
                        <Collapse
                          in={expandedRows[review._id]}
                          timeout="auto"
                          unmountOnExit
                        >
                          <Box
                            sx={{
                              margin: 2,
                              padding: 2,
                              border: "1px solid #ddd",
                              borderRadius: "10px",
                              backgroundColor: "#f9f9f9",
                              boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
                            }}
                          >
                            <p>
                              <strong>User Comment:</strong> {review.comment}
                            </p>
                            <p>
                              <strong>Review At:</strong>{" "}
                              {new Date(review.createdAt).toLocaleDateString()}
                            </p>
                            {hasReply && (
                              <p className="mt-3 bg-yellow-300 p-2 rounded-md">
                                <strong>Your Reply:</strong>{" "}
                                {review.sellerReply?.text}
                              </p>
                            )}
                          </Box>
                        </Collapse>
                      </TableCell>
                    </TableRow>
                  </React.Fragment>
                );
              })
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
    </div>
  );
};

export default Reviews;
