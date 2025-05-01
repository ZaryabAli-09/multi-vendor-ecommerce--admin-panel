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
  Pagination,
  Chip,
  IconButton,
  Tooltip,
  Skeleton,
  CircularProgress,
} from "@mui/material";
import {
  FaCheckCircle as ApproveIcon,
  FaTimes as RejectIcon,
  FaInfoCircle as InfoIcon,
} from "react-icons/fa";
import { toast } from "react-hot-toast";
import {
  HiOutlineOfficeBuilding,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineCalendar,
} from "react-icons/hi";
import { FiCheckCircle, FiClock, FiXCircle } from "react-icons/fi";

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
  const [processing, setProcessing] = useState({
    approve: false,
    reject: false,
  });

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
      setProcessing({ ...processing, approve: true });
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
      setProcessing({ ...processing, approve: false });
    }
  };

  const handleReject = async (sellerId) => {
    if (!rejectReason.trim()) {
      toast.error("Please provide a reason for rejection");
      return;
    }

    try {
      setProcessing({ ...processing, reject: true });
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
      setProcessing({ ...processing, reject: false });
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div className="flex items-center gap-3 mb-4 md:mb-0">
          <HiOutlineOfficeBuilding className="text-2xl text-gray-800" />
          <h1 className="text-2xl font-bold text-gray-800">Seller Requests</h1>
        </div>
      </div>

      {/* Table */}
      <TableContainer
        component={Paper}
        className="rounded-lg border border-gray-200"
      >
        <Table className="min-w-full">
          <TableHead className="bg-gray-100">
            <TableRow>
              <TableCell className="font-semibold">Brand Name</TableCell>
              <TableCell className="font-semibold">Email</TableCell>
              <TableCell className="font-semibold">Contact</TableCell>
              <TableCell className="font-semibold">Request Date</TableCell>
              <TableCell className="font-semibold">Status</TableCell>
              <TableCell className="font-semibold text-right">
                Actions
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isFetching ? (
              Array.from({ length: limit }).map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  <TableCell>
                    <Skeleton variant="text" width={120} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width={150} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width={100} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width={90} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width={80} />
                  </TableCell>
                  <TableCell align="right">
                    <div className="flex justify-end gap-2">
                      <Skeleton variant="circular" width={32} height={32} />
                      <Skeleton variant="circular" width={32} height={32} />
                      <Skeleton variant="circular" width={32} height={32} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : sellers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-10 text-gray-500"
                >
                  No pending seller requests found
                </TableCell>
              </TableRow>
            ) : (
              sellers.map((seller) => (
                <TableRow key={seller._id} hover className="hover:bg-gray-50">
                  <TableCell className="font-medium">
                    {seller.brandName}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <HiOutlineMail className="text-gray-500" />
                      {seller.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <HiOutlinePhone className="text-gray-500" />
                      {seller.contactNumber}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <HiOutlineCalendar className="text-gray-500" />
                      {formatDate(seller.createdAt)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={seller.status}
                      size="small"
                      sx={{
                        backgroundColor:
                          seller.status === "pending"
                            ? "rgba(254, 243, 199, 1)" // yellow-100
                            : seller.status === "approved"
                            ? "rgba(220, 252, 231, 1)" // green-100
                            : "rgba(254, 226, 226, 1)", // red-100
                        color:
                          seller.status === "pending"
                            ? "rgba(146, 64, 14, 1)" // yellow-800
                            : seller.status === "approved"
                            ? "rgba(22, 101, 52, 1)" // green-800
                            : "rgba(153, 27, 27, 1)", // red-800
                        fontWeight: "500",
                        fontSize: "0.75rem",
                        paddingLeft: "8px",
                        "& .MuiChip-icon": {
                          marginLeft: "4px",
                          marginRight: "-4px",
                        },
                      }}
                      icon={
                        seller.status === "pending" ? (
                          <FiClock size={14} />
                        ) : seller.status === "approved" ? (
                          <FiCheckCircle size={14} />
                        ) : (
                          <FiXCircle size={14} />
                        )
                      }
                    />
                  </TableCell>
                  <TableCell align="right">
                    <div className="flex justify-end gap-1">
                      {/* View Details Button */}
                      <Tooltip title="View Details" arrow>
                        <IconButton
                          onClick={() => handleViewDetails(seller)}
                          className="text-blue-600 hover:bg-blue-50/50 transition-colors"
                          size="small"
                          sx={{
                            "&:hover": {
                              backgroundColor: "rgba(59, 130, 246, 0.1)",
                              transform: "scale(1.05)",
                            },
                          }}
                        >
                          <InfoIcon className="text-blue-600" size={18} />
                        </IconButton>
                      </Tooltip>

                      {/* Approve Button */}
                      <Tooltip title="Approve" arrow>
                        <IconButton
                          onClick={() => handleApprove(seller._id)}
                          className="text-emerald-600 hover:bg-emerald-50/50 transition-colors"
                          disabled={processing.approve}
                          size="small"
                          sx={{
                            "&:hover:not(:disabled)": {
                              backgroundColor: "rgba(16, 185, 129, 0.1)",
                              transform: "scale(1.05)",
                            },
                          }}
                        >
                          {processing.approve ? (
                            <CircularProgress
                              size={18}
                              className="text-emerald-600"
                            />
                          ) : (
                            <ApproveIcon
                              className="text-emerald-600"
                              size={18}
                            />
                          )}
                        </IconButton>
                      </Tooltip>

                      {/* Reject Button */}
                      <Tooltip title="Reject" arrow>
                        <IconButton
                          onClick={() => {
                            setSelectedSeller(seller);
                            setRejectDialogOpen(true);
                          }}
                          className="text-rose-600 hover:bg-rose-50/50 transition-colors"
                          disabled={processing.reject}
                          size="small"
                          sx={{
                            "&:hover:not(:disabled)": {
                              backgroundColor: "rgba(244, 63, 94, 0.1)",
                              transform: "scale(1.05)",
                            },
                          }}
                        >
                          {processing.reject ? (
                            <CircularProgress
                              size={18}
                              className="text-rose-600"
                            />
                          ) : (
                            <RejectIcon className="text-rose-600" size={18} />
                          )}
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

      {/* Pagination */}
      {!isFetching && sellers.length > 0 && (
        <div className="flex justify-center mt-6">
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            className="[&_.MuiPaginationItem-root]:text-gray-700 [&_.Mui-selected]:bg-black [&_.Mui-selected]:text-white"
            showFirstButton
            showLastButton
          />
        </div>
      )}

      {/* Seller Details Modal */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        className="flex items-center justify-center"
      >
        <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto outline-none">
          <div className="p-6">
            {selectedSeller && (
              <>
                <div className="flex items-center gap-3 mb-6">
                  <HiOutlineOfficeBuilding className="text-2xl text-gray-800" />
                  <h2 className="text-xl font-bold text-gray-800">
                    {selectedSeller.brandName} Details
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-700 border-b pb-2">
                      Basic Information
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <HiOutlineMail className="text-gray-500" />
                        <span>
                          <p className="text-sm text-gray-500">Email</p>
                          <p className="font-medium">{selectedSeller.email}</p>
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <HiOutlinePhone className="text-gray-500" />
                        <span>
                          <p className="text-sm text-gray-500">Contact</p>
                          <p className="font-medium">
                            {selectedSeller.contactNumber}
                          </p>
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <HiOutlineOfficeBuilding className="text-gray-500" />
                        <span>
                          <p className="text-sm text-gray-500">
                            Business Address
                          </p>
                          <p className="font-medium">
                            {selectedSeller.businessAddress || "N/A"}
                          </p>
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        <HiOutlineCalendar className="text-gray-500" />
                        <span>
                          <p className="text-sm text-gray-500">Request Date</p>
                          <p className="font-medium">
                            {formatDate(selectedSeller.createdAt)}
                          </p>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-700 border-b pb-2">
                      Brand Information
                    </h3>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Description</p>
                      <p className="font-medium">
                        {selectedSeller.brandDescription}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-4 border-t">
                  <Button
                    variant="contained"
                    className="bg-green-600 hover:bg-green-700 text-white normal-case"
                    onClick={() => handleApprove(selectedSeller._id)}
                    disabled={processing.approve}
                    startIcon={
                      processing.approve ? (
                        <svg
                          className="animate-spin h-4 w-4"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                      ) : (
                        <ApproveIcon />
                      )
                    }
                  >
                    {processing.approve ? "Approving..." : "Approve"}
                  </Button>
                  <Button
                    variant="outlined"
                    className="border-red-500 text-red-500 hover:bg-red-50 normal-case"
                    onClick={() => {
                      setOpenModal(false);
                      setRejectDialogOpen(true);
                    }}
                    disabled={processing.reject}
                    startIcon={<RejectIcon />}
                  >
                    Reject
                  </Button>
                  <Button
                    variant="outlined"
                    className="border-gray-300 text-gray-700 hover:bg-gray-100 normal-case"
                    onClick={handleCloseModal}
                  >
                    Close
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      </Modal>

      {/* Reject Dialog */}
      <Modal
        open={rejectDialogOpen}
        onClose={() => setRejectDialogOpen(false)}
        className="flex items-center justify-center"
      >
        <div className="bg-white rounded-xl shadow-lg w-full max-w-md outline-none">
          <div className="p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Reject Seller Application
            </h2>
            <p className="text-gray-600 mb-4">
              Please provide a reason for rejecting {selectedSeller?.brandName}
              's application:
            </p>

            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg mb-6 focus:ring-2 focus:ring-black focus:border-transparent"
              rows={4}
              placeholder="Enter rejection reason..."
            />

            <div className="flex justify-end gap-3">
              <Button
                variant="outlined"
                className="border-gray-300 text-gray-700 hover:bg-gray-100 normal-case"
                onClick={() => setRejectDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                className="bg-red-600 hover:bg-red-700 text-white normal-case"
                onClick={() => handleReject(selectedSeller?._id)}
                disabled={processing.reject || !rejectReason.trim()}
              >
                {processing.reject ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Rejecting...
                  </div>
                ) : (
                  "Confirm Reject"
                )}
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SellerRequests;
