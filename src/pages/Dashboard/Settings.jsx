import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  CircularProgress,
} from "@mui/material";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";

const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters long")
    .required("Password is required"),
});

export default function Settings() {
  const [open, setOpen] = useState(false);
  const [formType, setFormType] = useState(null); // 'email' or 'password'
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const handleOpen = (type) => {
    setFormType(type);
    setOpen(true);
    reset({
      email: user?.email || "",
      password: "••••••••", // Show masked password by default
    });
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const updateData =
        formType === "email"
          ? { email: data.email }
          : { password: data.password };

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/admin/update-credentials`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(updateData),
        }
      );

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.message);
      }

      toast.success(
        formType === "email"
          ? "Email updated successfully"
          : "Password changed successfully"
      );
      setOpen(false);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box className="max-w-3xl mx-auto p-6 bg-secondary rounded-md shadow-md">
      <h2 className="text-xl md:text-2xl text-center mb-6 font-bold text-dark">
        Account Settings
      </h2>

      <div className="flex flex-col gap-4">
        <div className="flex items-center border space-x-1 border-gray-100 w-fit rounded-md p-4">
          <span className="text-3xl relative -top-2">......</span>
          <Button
            className="w-fit text-3xl"
            variant="text"
            color="warning"
            size="small"
            onClick={() => handleOpen("email")}
          >
            Update Email
          </Button>
        </div>

        <div className="flex items-center border space-x-1 border-gray-100 w-fit rounded-md p-4">
          <span className="text-3xl relative -top-2">......</span>
          <Button
            className="w-fit text-3xl"
            variant="text"
            color="warning"
            size="small"
            onClick={() => handleOpen("password")}
          >
            Change Password
          </Button>
        </div>
      </div>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>
          {formType === "email" ? "Update Email" : "Change Password"}
        </DialogTitle>
        <DialogContent>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col gap-4 w-72"
          >
            {formType === "email" ? (
              <TextField
                label="Email"
                type="email"
                fullWidth
                variant="outlined"
                defaultValue={user?.email || ""}
                {...register("email")}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            ) : (
              <TextField
                label="New Password"
                type="password"
                fullWidth
                variant="outlined"
                defaultValue="••••••••"
                {...register("password")}
                error={!!errors.password}
                helperText={errors.password?.message}
                onFocus={(e) => {
                  if (e.target.value === "••••••••") {
                    e.target.value = "";
                  }
                }}
              />
            )}
          </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="error" size="small">
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit(onSubmit)}
            color="success"
            size="small"
            variant="contained"
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
