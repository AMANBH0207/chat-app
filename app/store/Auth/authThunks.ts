import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { UserLoginData } from "./authTypes";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

export const loginUser = createAsyncThunk(
  "auth/login",
  async (data: UserLoginData, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/api/auth/login`,
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
         `${BASE_URL}/api/auth/register`,
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

// 🔥 GET ME
export const getMe = createAsyncThunk(
  "auth/getMe",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/auth/me`,
        { withCredentials: true }
      );

      return res.data;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to fetch user"
      );
    }
  }
);