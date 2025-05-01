import { useEffect, useState } from "react";
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
  CircularProgress,
} from "@mui/material";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import { HiOutlineMail, HiOutlineLockClosed } from "react-icons/hi";
import { MdOutlineSettings } from "react-icons/md";

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
  const [user, setUser] = useState(null);
  const fetchadmin = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/single`, {
        credentials: "include",
      });

      const result = await res.json();
      if (!res.ok) {
        toast.error(result.message);
        return;
      }
      setUser(result.data);
    } catch (error) {
      toast.error(error.message);
    }
  };
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

  useEffect(() => {
    fetchadmin();
  }, []);
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
      fetchadmin();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Header */}
      <div className="flex flex-col items-center mb-8">
        <MdOutlineSettings className="text-3xl text-gray-800 mb-2" />
        <h2 className="text-2xl font-bold text-gray-800">Account Settings</h2>
        <p className="text-gray-500 text-sm mt-1">
          Manage your account credentials
        </p>
      </div>

      {/* Settings Cards */}
      <div className="grid gap-4">
        {/* Email Update Card */}
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-full">
              <HiOutlineMail className="text-blue-600 text-xl" />
            </div>
            <div>
              <h3 className="font-medium text-gray-800">Email Address</h3>
              <p className="text-sm text-gray-500">{user?.email}</p>
            </div>
          </div>
          <Button
            variant="outlined"
            onClick={() => handleOpen("email")}
            className="border-gray-300 text-gray-700 hover:bg-gray-100 normal-case"
          >
            Update
          </Button>
        </div>

        {/* Password Update Card */}
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-full">
              <HiOutlineLockClosed className="text-green-600 text-xl" />
            </div>
            <div>
              <h3 className="font-medium text-gray-800">Password</h3>
              <p className="text-sm text-gray-500">••••••••</p>
            </div>
          </div>
          <Button
            variant="outlined"
            onClick={() => handleOpen("password")}
            className="border-gray-300 text-gray-700 hover:bg-gray-100 normal-case"
          >
            Change
          </Button>
        </div>
      </div>

      {/* Update Dialog */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        PaperProps={{ className: "rounded-xl max-w-md w-full" }}
      >
        <DialogTitle className="flex items-center gap-2 font-semibold">
          {formType === "email" ? (
            <>
              <HiOutlineMail className="text-blue-500" />
              Update Email Address
            </>
          ) : (
            <>
              <HiOutlineLockClosed className="text-green-500" />
              Change Password
            </>
          )}
        </DialogTitle>
        <DialogContent className="py-4">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {formType === "email" ? (
              <TextField
                fullWidth
                label="New Email"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <HiOutlineMail className="mr-2 text-gray-400" />
                  ),
                }}
                defaultValue={user?.email || ""}
                {...register("email")}
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            ) : (
              <TextField
                fullWidth
                label="New Password"
                type="password"
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <HiOutlineLockClosed className="mr-2 text-gray-400" />
                  ),
                }}
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
        <DialogActions className="px-6 pb-4">
          <Button
            onClick={() => setOpen(false)}
            className="text-gray-700 hover:bg-gray-100 px-4 py-2 rounded-lg font-medium"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit(onSubmit)}
            variant="contained"
            disabled={loading}
            className={`${
              formType === "email"
                ? "bg-blue-600 hover:bg-blue-700"
                : "bg-green-600 hover:bg-green-700"
            } text-white px-4 py-2 rounded-lg font-medium`}
          >
            {loading ? (
              <CircularProgress size={24} className="text-white" />
            ) : (
              "Save Changes"
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
