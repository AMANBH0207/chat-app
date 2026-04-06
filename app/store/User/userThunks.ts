import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { SearchUsersResponse, User } from "./userTypes";

export const searchUsers = createAsyncThunk<
  User[],
  string,
  { rejectValue: string }
>(
  "user/searchUsers",
  async (query, { rejectWithValue }) => {
    try {
      const res = await axios.get<SearchUsersResponse>(
        `http://localhost:5000/api/users/search`,
        {
          params: { search: query },
          withCredentials: true, 
        }
      );

      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Something went wrong"
      );
    }
  }
);

