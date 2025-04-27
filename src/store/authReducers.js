import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { toast } from "react-hot-toast";

export const login = createAsyncThunk(
  "auth/login",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
        credentials: "include", // Ensures cookies are sent and received
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message);
        return rejectWithValue(data.message);
      } else {
        toast.success(data.message);
        return data;
      }
    } catch (error) {
      toast.error(error.message);
      return rejectWithValue(error.message);
    }
  }
);

export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/logout`, {
        method: "POST",
        credentials: "include",
      });
      const data = await res.json();

      if (!res.ok) {
        toast.error(data.message);
        return rejectWithValue(data.message);
      }

      toast.success(data.message);
      return true;
    } catch (error) {
      toast.error(error.message);
      return rejectWithValue(error.message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // user logging in
      .addCase(login.pending, (state, action) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.data;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // user logout
      .addCase(logout.pending, (state) => {
        state.loading = true; // Set loading to true when starting logout
      })
      .addCase(logout.fulfilled, (state) => {
        // Reset state on successful logout
        state.user = null;
        state.loading = false; // Set loading to false
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false; // Set loading to false on error
        state.error = action.payload; // Capture the error message
      });
  },
});

export default authSlice.reducer;
