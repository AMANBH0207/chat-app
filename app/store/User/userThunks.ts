import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { SearchUsersResponse, User } from "./userTypes";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

export const searchUsers = createAsyncThunk<
  User[],
  string,
  { rejectValue: string }
>(
  "user/searchUsers",
  async (query, { rejectWithValue }) => {
    try {
      const res = await axios.get<SearchUsersResponse>(
        `${BASE_URL}/api/users/search`,
        {
          params: { search: query },
          withCredentials: true,
        }
      );

      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message ||
          "Something went wrong"
      );
    }
  }
);