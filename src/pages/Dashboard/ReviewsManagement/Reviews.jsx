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
  Chip,
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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const limit = 10;

  const fetchReviews = async (page, filters = {}) => {
    try {
      setIsFetching(true);
      setReviews([]); // Clear previous results while loading

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

      if (!res.ok) {
        toast.error(result.message);
        setReviews([]);
        setTotalPages(0);
        setTotalItems(0);
      } else {
        setReviews(result.data.data || []);
        setTotalItems(result.data.total || 0);
        setTotalPages(Math.ceil(result.data.total / limit) || 1);
      }
    } catch (error) {
      toast.error(error.message);
      setReviews([]);
      setTotalPages(0);
      setTotalItems(0);
    } finally {
      setIsFetching(false);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const applyFilters = () => {
    setCurrentPage(1);
    fetchReviews(1, filters);
  };

  const clearFilters = () => {
    setFilters({
      replyStatus: "",
      productName: "",
      dateFilter: "",
    });
    setCurrentPage(1);
    fetchReviews(1);
  };

  const handlePageChange = (event, page) => {
    setCurrentPage(page);
    fetchReviews(page, filters);
  };

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
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="">All Reviews</MenuItem>
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
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="">All Time</MenuItem>
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

      <TableContainer component={Paper}>
        <Box sx={{ p: 3 }}>
          <h2 className="text-xl md:text-2xl mb-6">Manage Reviews</h2>

          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Review User</TableCell>
                <TableCell>Product</TableCell>
                <TableCell>Brand/Store</TableCell>
                <TableCell>Rating</TableCell>
                <TableCell>Reply Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {isFetching ? (
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
                      <Skeleton variant="rectangular" width={100} height={30} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="rectangular" width={100} height={40} />
                    </TableCell>
                    <TableCell>
                      <Skeleton variant="rectangular" width={100} height={40} />
                    </TableCell>
                  </TableRow>
                ))
              ) : reviews.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 4 }}>
                    <Typography variant="body1" color="textSecondary">
                      {totalItems === 0
                        ? "No reviews found matching your criteria"
                        : "Loading..."}
                    </Typography>
                  </TableCell>
                </TableRow>
              ) : (
                reviews.map((review, i) => {
                  const hasReply = review.sellerReply?.text;
                  const rowNumber = (currentPage - 1) * limit + i + 1;

                  return (
                    <React.Fragment key={review._id}>
                      <TableRow>
                        <TableCell>{rowNumber}</TableCell>
                        <TableCell>{review.user?.name || "Unknown"}</TableCell>
                        <TableCell>
                          {review.product?.name || "Deleted Product"}
                        </TableCell>
                        <TableCell>
                          {review.product?.seller?.brandName || "N/A"}
                        </TableCell>
                        <TableCell>
                          <StarRating rating={review.rating} />
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={hasReply ? "Replied" : "Not Replied"}
                            color={hasReply ? "success" : "warning"}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => toggleExpand(review._id)}
                          >
                            {expandedRows[review._id] ? "Hide" : "View"}
                          </Button>
                        </TableCell>
                      </TableRow>

                      {/* Expanded Row */}
                      <TableRow>
                        <TableCell colSpan={7} style={{ padding: 0 }}>
                          <Collapse
                            in={expandedRows[review._id]}
                            timeout="auto"
                            unmountOnExit
                          >
                            <Box sx={{ p: 2, bgcolor: "background.paper" }}>
                              <Typography variant="subtitle1" gutterBottom>
                                <strong>Review Details</strong>
                              </Typography>
                              <Typography paragraph>
                                <strong>Comment:</strong>{" "}
                                {review.comment || "No comment"}
                              </Typography>
                              <Typography paragraph>
                                <strong>Date:</strong>{" "}
                                {new Date(
                                  review.createdAt
                                ).toLocaleDateString()}
                              </Typography>
                              {hasReply && (
                                <Box
                                  sx={{
                                    mt: 2,
                                    p: 2,
                                    bgcolor: "warning.light",
                                    borderRadius: 1,
                                  }}
                                >
                                  <Typography variant="subtitle2">
                                    <strong>Your Reply:</strong>
                                  </Typography>
                                  <Typography>
                                    {review.sellerReply.text}
                                  </Typography>
                                </Box>
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
        </Box>
      </TableContainer>

      {/* Pagination */}
      {!isFetching && totalPages > 1 && (
        <Box sx={{ display: "flex", justifyContent: "center", my: 3 }}>
          <Pagination
            count={totalPages}
            page={currentPage}
            onChange={handlePageChange}
            color="primary"
            showFirstButton
            showLastButton
          />
        </Box>
      )}
    </div>
  );
};

export default Reviews;
