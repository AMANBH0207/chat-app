export interface Message {
  _id: string;
  text: string;
  senderId: {
    _id: string;
    name: string;
    avatarUrl: string;
  };
  createdAt: string;
}

export interface MessagesState {
  messages: Message[];
  loading: boolean;
  error: string | null;
}