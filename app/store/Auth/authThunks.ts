import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const loginUser = createAsyncThunk(
  "auth/login",
  async (data: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/login",
        data,
        { withCredentials: true }
      );

      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message || "Login failed"
      );
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (
    data: { name: string; email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/register",
        data
      );

      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message || "Register failed"
      );
    }
  }
);