import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchMessages = createAsyncThunk(
  "messages/fetchMessages",
  async (roomId: string, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/messages/${roomId}`,
        {
          withCredentials: true,
        }
      );
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);

export const sendUserMessage = createAsyncThunk(
  "messages/sendUserMessage",
  async (
    { roomId, text }: { roomId: string; text: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/messages/send",
        {
          roomId,
          text,
        },
        {
          withCredentials: true,
        }
      );
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  }
);