import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Modal,
  Box,
  Typography,
  Pagination,
  Chip,
  IconButton,
  Tooltip,
  Skeleton,
} from "@mui/material";
import {
  FaCheckCircle as ApproveIcon,
  FaTimes as RejectIcon,
  FaInfoCircle as InfoIcon,
} from "react-icons/fa";
import { toast } from "react-hot-toast";

const SellerRequests = () => {
  const [sellers, setSellers] = useState([]);
  const [isFetching, setIsFetching] = useState(true);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedSeller, setSelectedSeller] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [processing, setProcessing] = useState(false);

  const fetchPendingSellers = async (page = 1) => {
    try {
      setIsFetching(true);
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/seller/pending?page=${page}&limit=${limit}`,
        {
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch sellers");
      }

      const data = await response.json();
      setSellers(data.data.sellers);
      setTotalPages(data.data.pages);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsFetching(false);
    }
  };

  useEffect(() => {
    fetchPendingSellers(page);
  }, [page]);

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleViewDetails = (seller) => {
    setSelectedSeller(seller);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedSeller(null);
  };

  const handleApprove = async (sellerId) => {
    try {
      setProcessing(true);
      const response = await fetch(
        `${
          import.meta.env.VITE_API_URL
        }/seller/auth/approve-seller/${sellerId}`,
        {
          method: "PUT",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to approve seller");
      }

      toast.success("Seller approved successfully");
      fetchPendingSellers(page);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async (sellerId) => {
    if (!rejectReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    try {
      setProcessing(true);
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/seller/auth/reject-seller/${sellerId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ reason: rejectReason }),
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to reject seller");
      }

      toast.success("Seller rejected successfully");
      setRejectDialogOpen(false);
      setRejectReason("");
      fetchPendingSellers(page);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setProcessing(false);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Seller Requests</h1>

      <TableContainer component={Paper} className="shadow-md">
        <Table>
          <TableHead className="bg-gray-100">
            <TableRow>
              <TableCell className="font-bold">Brand Name</TableCell>
              <TableCell className="font-bold">Email</TableCell>
              <TableCell className="font-bold">Contact</TableCell>
              <TableCell className="font-bold">Request Date</TableCell>
              <TableCell className="font-bold">Status</TableCell>
              <TableCell className="font-bold text-right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isFetching ? (
              Array.from({ length: limit }).map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  {[...Array(6)].map((_, i) => (
                    <TableCell key={`skeleton-cell-${i}`}>
                      <Skeleton variant="text" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : sellers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  No pending seller requests found
                </TableCell>
              </TableRow>
            ) : (
              sellers.map((seller) => (
                <TableRow key={seller._id} hover>
                  <TableCell>{seller.brandName}</TableCell>
                  <TableCell>{seller.email}</TableCell>
                  <TableCell>{seller.contactNumber}</TableCell>
                  <TableCell>{formatDate(seller.createdAt)}</TableCell>
                  <TableCell>
                    <Chip
                      label={seller.status}
                      color={
                        seller.status === "pending"
                          ? "warning"
                          : seller.status === "approved"
                          ? "success"
                          : "error"
                      }
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <div className="flex justify-end space-x-2">
                      <Tooltip title="View Details">
                        <IconButton
                          onClick={() => handleViewDetails(seller)}
                          className="text-blue-500"
                        >
                          <InfoIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Approve">
                        <IconButton
                          onClick={() => handleApprove(seller._id)}
                          className="text-green-500"
                          disabled={processing}
                        >
                          <ApproveIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Reject">
                        <IconButton
                          onClick={() => {
                            setSelectedSeller(seller);
                            setRejectDialogOpen(true);
                          }}
                          className="text-red-500"
                          disabled={processing}
                        >
                          <RejectIcon />
                        </IconButton>
                      </Tooltip>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {!isFetching && sellers.length > 0 && (
        <div className="flex justify-center mt-6">
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            showFirstButton
            showLastButton
          />
        </div>
      )}

      {/* Seller Details Modal */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="seller-details-modal"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            maxWidth: "800px",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
            maxHeight: "90vh",
            overflowY: "auto",
          }}
        >
          {selectedSeller && (
            <>
              <Typography
                id="seller-details-modal"
                variant="h5"
                component="h2"
                className="mb-4"
              >
                {selectedSeller.brandName} Details
              </Typography>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Typography variant="subtitle1" className="font-bold mb-2">
                    Basic Information
                  </Typography>
                  <div className="space-y-2">
                    <p>
                      <span className="font-semibold">Email:</span>{" "}
                      {selectedSeller.email}
                    </p>
                    <p>
                      <span className="font-semibold">Contact:</span>{" "}
                      {selectedSeller.contactNumber}
                    </p>
                    <p>
                      <span className="font-semibold">Business Address:</span>{" "}
                      {selectedSeller.businessAddress || "N/A"}
                    </p>
                    <p>
                      <span className="font-semibold">Request Date:</span>{" "}
                      {formatDate(selectedSeller.createdAt)}
                    </p>
                  </div>
                </div>

                <div>
                  <Typography variant="subtitle1" className="font-bold mb-2">
                    Brand Information
                  </Typography>
                  <div className="space-y-2">
                    <p>
                      <span className="font-semibold">Brand Description:</span>{" "}
                      {selectedSeller.brandDescription}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end mt-6 space-x-3">
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => handleApprove(selectedSeller._id)}
                  disabled={processing}
                  startIcon={<ApproveIcon />}
                >
                  Approve
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  onClick={() => {
                    setOpenModal(false);
                    setRejectDialogOpen(true);
                  }}
                  disabled={processing}
                  startIcon={<RejectIcon />}
                >
                  Reject
                </Button>
                <Button
                  variant="outlined"
                  onClick={handleCloseModal}
                  className="ml-2"
                >
                  Close
                </Button>
              </div>
            </>
          )}
        </Box>
      </Modal>

      {/* Reject Dialog */}
      <Modal
        open={rejectDialogOpen}
        onClose={() => setRejectDialogOpen(false)}
        aria-labelledby="reject-seller-modal"
      >
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "80%",
            maxWidth: "500px",
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
            borderRadius: 2,
          }}
        >
          <Typography
            id="reject-seller-modal"
            variant="h6"
            component="h2"
            className="mb-4"
          >
            Reject Seller Application
          </Typography>
          <Typography variant="body1" className="mb-4">
            Please provide a reason for rejecting {selectedSeller?.brandName}'s
            application:
          </Typography>

          <textarea
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded mb-4"
            rows={4}
            placeholder="Enter rejection reason..."
          />

          <div className="flex justify-end space-x-3">
            <Button
              variant="outlined"
              onClick={() => setRejectDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              color="error"
              onClick={() => handleReject(selectedSeller?._id)}
              disabled={processing || !rejectReason.trim()}
            >
              {processing ? "Processing..." : "Confirm Reject"}
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
};

export default SellerRequests;
