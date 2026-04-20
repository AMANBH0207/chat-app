import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:5000";

/* JOIN ROOM */
export const joinRoom = createAsyncThunk<
  any,
  string,
  { rejectValue: string }
>(
  "chat/joinRoom",
  async (receiverId, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/api/rooms/join-room`,
        { receiverId },
        {
          withCredentials: true,
        }
      );

      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message ||
          "Failed to create room"
      );
    }
  }
);

/* GET MY ROOMS */
export const getMyRooms = createAsyncThunk(
  "chat/getMyRooms",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `${BASE_URL}/api/rooms/my-rooms`,
        {
          withCredentials: true,
        }
      );

      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message ||
          "Failed to fetch rooms"
      );
    }
  }
);