import React, { useEffect, useState } from "react";
import {
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Modal,
  Button,
  TextField,
  Select,
  MenuItem,
  Skeleton,
} from "@mui/material";
import toast from "react-hot-toast";
import {
  HiOutlineChatAlt2,
  HiOutlineMail,
  HiOutlineRefresh,
} from "react-icons/hi";
import { FiCheckCircle, FiClock, FiEye } from "react-icons/fi";

const SupportAndDisputes = () => {
  const [tab, setTab] = useState("seller");
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true); // Initial loading state
  const [updating, setUpdating] = useState(false); // For button loader
  const [openModal, setOpenModal] = useState(false);
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  const fetchDisputes = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/support&disputes/all`,
        {
          credentials: "include",
        }
      );
      const data = await res.json();
      if (res.ok) {
        const filtered = data.data.filter(
          (item) => item.fromType.toLowerCase() === tab
        );
        setDisputes(filtered);
      } else {
        toast.error(data.message || "Failed to fetch disputes");
      }
    } catch (error) {
      toast.error("An error occurred while fetching disputes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDisputes();
  }, [tab]);

  const handleUpdateStatus = async () => {
    try {
      setUpdating(true);
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/support&disputes/update/${
          selectedDispute._id
        }`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ status: newStatus }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        toast.success("Status updated successfully!");
        setOpenModal(false);
        fetchDisputes();
      } else {
        toast.error(data.message || "Failed to update status");
      }
    } catch (error) {
      toast.error("An error occurred while updating status");
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <FiClock className="mr-1" /> Pending
          </span>
        );
      case "resolved":
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <FiCheckCircle className="mr-1" /> Resolved
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  // Skeleton loader rows
  const skeletonRows = Array(5).fill(0);

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div className="flex items-center gap-3 mb-4 md:mb-0">
          <HiOutlineChatAlt2 className="text-2xl text-gray-800" />
          <h1 className="text-2xl font-bold text-gray-800">
            Support & Disputes
          </h1>
        </div>
        <Button
          variant="outlined"
          startIcon={<HiOutlineRefresh />}
          onClick={fetchDisputes}
          className="border-gray-300 text-gray-700 hover:bg-gray-50 normal-case"
        >
          Refresh
        </Button>
      </div>

      {/* Tabs */}
      <Tabs
        value={tab}
        onChange={(e, newValue) => setTab(newValue)}
        className="mb-6"
        textColor="primary"
        indicatorColor="primary"
      >
        <Tab
          value="seller"
          label={
            <div className="flex items-center gap-2">
              <span>Seller Support</span>
              {!loading &&
                disputes.filter((d) => d.fromType === "seller").length > 0 && (
                  <span className="bg-gray-200 text-gray-800 text-xs font-medium px-2 py-0.5 rounded-full">
                    {disputes.filter((d) => d.fromType === "seller").length}
                  </span>
                )}
            </div>
          }
        />
        <Tab
          value="buyer"
          label={
            <div className="flex items-center gap-2">
              <span>User Support</span>
              {!loading &&
                disputes.filter((d) => d.fromType === "buyer").length > 0 && (
                  <span className="bg-gray-200 text-gray-800 text-xs font-medium px-2 py-0.5 rounded-full">
                    {disputes.filter((d) => d.fromType === "buyer").length}
                  </span>
                )}
            </div>
          }
        />
      </Tabs>

      {/* Table */}
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <Table className="min-w-full">
          <TableHead className="bg-gray-100">
            <TableRow>
              <TableCell className="font-semibold">Subject</TableCell>
              <TableCell className="font-semibold">Email</TableCell>
              <TableCell className="font-semibold">Status</TableCell>
              <TableCell className="font-semibold">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {loading ? (
              skeletonRows.map((_, index) => (
                <TableRow key={`skeleton-${index}`}>
                  <TableCell>
                    <Skeleton variant="text" width={150} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width={120} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width={80} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="rectangular" width={80} height={30} />
                  </TableCell>
                </TableRow>
              ))
            ) : disputes.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-10 text-gray-500"
                >
                  No {tab === "seller" ? "seller" : "user"} disputes found
                </TableCell>
              </TableRow>
            ) : (
              disputes.map((dispute) => (
                <TableRow key={dispute._id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">
                    {dispute.subject}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <HiOutlineMail className="text-gray-500" />
                      {dispute.fromId?.email}
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(dispute.status)}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<FiEye />}
                      onClick={() => {
                        setSelectedDispute(dispute);
                        setNewStatus(dispute.status);
                        setOpenModal(true);
                      }}
                      className="border-gray-300 text-gray-700 hover:bg-gray-100 normal-case"
                    >
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dispute Details Modal */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-xl shadow-lg w-full max-w-lg outline-none">
          <div className="p-6">
            <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
              <HiOutlineChatAlt2 />
              Dispute Details
            </h2>

            {selectedDispute && (
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <h3 className="font-medium text-gray-700">Subject</h3>
                  <p className="mt-1">{selectedDispute.subject}</p>
                </div>

                <div className="border-b pb-4">
                  <h3 className="font-medium text-gray-700">Message</h3>
                  <p className="mt-1 whitespace-pre-line">
                    {selectedDispute.message}
                  </p>
                </div>

                <div className="border-b pb-4">
                  <h3 className="font-medium text-gray-700">Current Status</h3>
                  <div className="mt-1">
                    {getStatusBadge(selectedDispute.status)}
                  </div>
                </div>

                <div>
                  <h3 className="font-medium text-gray-700 mb-2">
                    Update Status
                  </h3>
                  <Select
                    fullWidth
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="bg-gray-50"
                  >
                    <MenuItem value="pending">Pending</MenuItem>
                    <MenuItem value="resolved">Resolved</MenuItem>
                  </Select>
                </div>

                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    variant="outlined"
                    onClick={() => setOpenModal(false)}
                    className="border-gray-300 text-gray-700 hover:bg-gray-100 normal-case"
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    onClick={handleUpdateStatus}
                    disabled={updating}
                    className="bg-black hover:bg-gray-800 text-white normal-case min-w-24"
                  >
                    {updating ? (
                      <div className="flex items-center justify-center">
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
                        Saving...
                      </div>
                    ) : (
                      "Save Changes"
                    )}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SupportAndDisputes;
