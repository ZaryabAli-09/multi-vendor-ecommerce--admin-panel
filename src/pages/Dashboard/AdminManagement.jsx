import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Button,
  TextField,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Avatar,
  Chip,
  Skeleton,
} from "@mui/material";
import { toast } from "react-hot-toast";
import {
  HiOutlineUserAdd,
  HiOutlineMail,
  HiOutlineKey,
  HiOutlineShieldCheck,
} from "react-icons/hi";
import {
  MdAdminPanelSettings,
  MdOutlineAdminPanelSettings,
} from "react-icons/md";

const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Required"),
  password: yup.string().min(6, "Minimum 6 characters").required("Required"),
});

export default function AdminSettings() {
  const [admins, setAdmins] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const fetchAdmins = async () => {
    try {
      setFetching(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/all`, {
        credentials: "include",
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message);
      setAdmins(result.data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setFetching(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/new`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(data),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message);

      toast.success("Admin added successfully");
      setOpen(false);
      reset();
      fetchAdmins();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  return (
    <div className="p-6">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div className="flex items-center gap-3">
          <MdAdminPanelSettings className="text-2xl text-gray-800" />
          <h2 className="text-2xl font-bold text-gray-800">Admin Management</h2>
        </div>
        <Button
          variant="contained"
          onClick={() => setOpen(true)}
          startIcon={<HiOutlineUserAdd />}
          sx={{
            backgroundColor: "#000",
          }}
          className="bg-black hover:bg-gray-800 px-4 py-2 rounded-lg normal-case font-semibold"
        >
          Add Admin
        </Button>
      </div>

      {/* Admins Table */}
      <TableContainer
        component={Paper}
        className="rounded-xl shadow-sm border border-gray-200"
      >
        <Table className="min-w-full">
          <TableHead className="bg-gray-100">
            <TableRow>
              <TableCell className="font-semibold text-gray-700">
                Admin
              </TableCell>
              <TableCell className="font-semibold text-gray-700">
                Email
              </TableCell>
              <TableCell className="font-semibold text-gray-700">
                Role
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {fetching ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow
                  key={`skeleton-${index}`}
                  className="hover:bg-gray-50"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Skeleton variant="circular" width={32} height={32} />
                      <div className="space-y-1">
                        <Skeleton variant="text" width={100} />
                        <Skeleton variant="text" width={60} />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant="text" width={80} />
                  </TableCell>
                </TableRow>
              ))
            ) : admins.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={3}
                  className="text-center py-8 text-gray-500"
                >
                  No admins found
                </TableCell>
              </TableRow>
            ) : (
              admins.map((admin, index) => (
                <TableRow
                  key={admin._id}
                  className="hover:bg-gray-50 border-b border-gray-100"
                >
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar
                        sx={{
                          bgcolor:
                            admin.title === "superadmin"
                              ? "#ef4444"
                              : "#3b82f6", // red-500/blue-500
                          color: "white",
                          width: 32,
                          height: 32,
                          fontSize: "0.875rem",
                          fontWeight: 500,
                        }}
                      >
                        {admin.email.charAt(0).toUpperCase()}
                      </Avatar>
                      <div>
                        <div className="font-medium">
                          {admin.title === "superadmin"
                            ? "Super Admin"
                            : "Admin"}{" "}
                          {index + 1}
                        </div>
                        <div className="text-xs text-gray-500">
                          ID: {admin._id.slice(-6)}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-gray-700">{admin.email}</TableCell>
                  <TableCell>
                    <Chip
                      label={
                        admin.title === "superadmin" ? "Super Admin" : "Admin"
                      }
                      size="small"
                      icon={
                        admin.title === "superadmin" ? (
                          <HiOutlineShieldCheck size={16} />
                        ) : null
                      }
                      sx={{
                        backgroundColor:
                          admin.title === "superadmin" ? "#fee2e2" : "#dbeafe",
                        color:
                          admin.title === "superadmin" ? "#991b1b" : "#1e40af",

                        pl: 2,
                      }}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Add Admin Dialog */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{ className: "rounded-xl p-2 w-full max-w-md" }}
      >
        <DialogTitle className="font-semibold flex items-center gap-2">
          <HiOutlineUserAdd className="text-gray-700" />
          Add New Admin
        </DialogTitle>
        <DialogContent className="pt-4 px-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <TextField
                fullWidth
                label="Email Address"
                InputProps={{
                  startAdornment: (
                    <HiOutlineMail className="mr-2 text-gray-500" />
                  ),
                  className: "pl-10",
                }}
                {...register("email")}
                error={!!errors.email}
                helperText={errors.email?.message}
                className="w-full"
              />
            </div>
            <div className="mb-2">
              <TextField
                fullWidth
                label="Password"
                type="password"
                InputProps={{
                  startAdornment: (
                    <HiOutlineKey className="mr-2 text-gray-500" />
                  ),
                  className: "pl-10",
                }}
                {...register("password")}
                error={!!errors.password}
                helperText={errors.password?.message}
                className="w-full"
              />
            </div>
          </form>
        </DialogContent>
        <DialogActions className="px-6 pb-4">
          <Button
            onClick={() => setOpen(false)}
            className="text-gray-700 font-medium px-4 py-2 rounded-lg hover:bg-gray-100"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            disabled={loading}
            variant="contained"
            className="bg-black hover:bg-gray-800 text-white font-medium px-4 py-2 rounded-lg normal-case"
          >
            {loading ? (
              <CircularProgress size={24} className="text-white" />
            ) : (
              "Create Admin"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
