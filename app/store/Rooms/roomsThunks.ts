import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const joinRoom = createAsyncThunk<any,string, { rejectValue: string }
>(
  "chat/joinRoom",
  async (receiverId, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/rooms/join-room",
        { receiverId },
        {
          withCredentials: true,
        }
      );

      return res.data.data; // room object
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to create room"
      );
    }
  }
);


export const getMyRooms = createAsyncThunk(
  "chat/getMyRooms",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        "http://localhost:5000/api/rooms/my-rooms",
        { withCredentials: true }
      );

      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message);
    }
  }
);