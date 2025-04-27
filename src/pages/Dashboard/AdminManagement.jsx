import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Button,
  TextField,
  Box,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { toast } from "react-hot-toast";

const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Required"),
  password: yup.string().min(6, "Minimum 6 characters").required("Required"),
});

export default function AdminSettings() {
  const [admins, setAdmins] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

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
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/all`, {
        credentials: "include",
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.message);
      setAdmins(result.data);
    } catch (error) {
      toast.error(error.message);
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
    <Box sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
      <h2 className="text-xl md:text-2xl mb-6"> Admin Management</h2>

      <Button variant="contained" onClick={() => setOpen(true)} sx={{ mb: 3 }}>
        Add New Admin
      </Button>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>#</TableCell>
              <TableCell>Email</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {admins.map((admin, index) => (
              <TableRow key={admin._id}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>{admin.email}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add New Admin</DialogTitle>
        <DialogContent sx={{ pt: 2 }}>
          <Box
            component="form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ mt: 1 }}
          >
            <TextField
              margin="normal"
              fullWidth
              label="Email"
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
            />
            <TextField
              margin="normal"
              fullWidth
              label="Password"
              type="password"
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            disabled={loading}
            variant="contained"
          >
            {loading ? <CircularProgress size={24} /> : "Add Admin"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
