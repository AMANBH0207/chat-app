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
        },
      );
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);

export const sendUserMessage = createAsyncThunk(
  "messages/sendUserMessage",
  async (
    { roomId, text, file }: { roomId: string; text?: string; file?: File },
    { rejectWithValue },
  ) => {
    try {
      const formData = new FormData();

      formData.append("roomId", roomId);
      if (text) formData.append("text", text);
      if (file) formData.append("file", file);

      const res = await axios.post(
        "http://localhost:5000/api/messages/send",
        formData,
        {
          withCredentials: true,
        },
      );

      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err.message);
    }
  },
);
