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
} from "@mui/material";
import toast from "react-hot-toast";

const SupprtAndDisputes = () => {
  const [tab, setTab] = useState("seller");
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  const fetchDisputes = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/support&disputes/all`
      ); // Adjust your API endpoint
      const data = await res.json();
      console.log(data);
      if (res.ok) {
        const filtered = data.data.filter(
          (item) => item.fromType.toLowerCase() === tab
        );
        setDisputes(filtered);
      } else {
        toast.error(data.message || "Failed to fetch disputes");
      }
    } catch (error) {
      console.error(error);
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
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/support&disputes/update/${
          selectedDispute._id
        }`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );
      const data = await res.json();
      if (res.ok) {
        toast.success("Status updated successfully!");
        setOpenModal(false);
        fetchDisputes(); // Refresh table
      } else {
        toast.error(data.message || "Failed to update status");
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while updating status");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-6">Support & Disputes Management</h1>

      <Tabs
        value={tab}
        onChange={(e, newValue) => setTab(newValue)}
        className="mb-4"
        textColor="primary"
        indicatorColor="primary"
      >
        <Tab value="seller" label="Seller Support" />
        <Tab value="buyer" label="User Support" />
      </Tabs>

      {loading ? (
        <div className="flex justify-center items-center py-10">
          <span className="text-gray-500">Loading disputes...</span>
        </div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <Table>
            <TableHead className="bg-gray-100">
              <TableRow>
                <TableCell>Subject</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {disputes.map((dispute) => (
                <TableRow key={dispute._id}>
                  <TableCell>{dispute.subject}</TableCell>
                  <TableCell>{dispute.fromId?.email}</TableCell>
                  <TableCell>{dispute.status}</TableCell>
                  <TableCell>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => {
                        setSelectedDispute(dispute);
                        setNewStatus(dispute.status);
                        setOpenModal(true);
                      }}
                    >
                      View / Update
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Modal for Viewing/Updating Dispute */}
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-full max-w-md shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Dispute Details</h2>
          {selectedDispute && (
            <>
              <p>
                <strong>Subject:</strong> {selectedDispute.subject}
              </p>
              <p className="mt-2">
                <strong>Message:</strong> {selectedDispute.message}
              </p>
              <p className="mt-2">
                <strong>Current Status:</strong> {selectedDispute.status}
              </p>

              <div className="mt-4">
                <Select
                  fullWidth
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  <MenuItem value="pending">Pending</MenuItem>
                  <MenuItem value="resolved">Resolved</MenuItem>
                </Select>
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleUpdateStatus}
                >
                  Save
                </Button>
                <Button variant="text" onClick={() => setOpenModal(false)}>
                  Cancel
                </Button>
              </div>
            </>
          )}
        </div>
      </Modal>
    </div>
  );
};

export default SupprtAndDisputes;
