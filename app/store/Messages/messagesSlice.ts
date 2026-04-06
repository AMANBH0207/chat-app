import { createSlice } from "@reduxjs/toolkit";
import { fetchMessages, sendUserMessage } from "./messagesThunks";
import { MessagesState } from "./messagesTypes";

const initialState: MessagesState = {
  messages: [],
  loading: false,
  error: null,
};

const messagesSlice = createSlice({
  name: "messages",
  initialState,
  reducers: {
    addMessageRealtime: (state, action) => {
      state.messages.push(action.payload);
    },

    clearMessages: (state) => {
      state.messages = [];
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        state.messages = action.payload;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(sendUserMessage.fulfilled, (state, action) => {
        state.messages.push(action.payload);
      });
  },
});

export const { addMessageRealtime, clearMessages } =
  messagesSlice.actions;

export default messagesSlice.reducer;