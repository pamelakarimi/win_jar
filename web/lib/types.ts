// The shapes of the data we get back from the backend.
export type Win = {
  id: number;
  text: string;
  emoji: string | null;
  date: string; // "YYYY-MM-DD"
  createdAt: string;
  userId: number;
};

export type AuthResponse = {
  token: string;
  user: { id: number; email: string };
};
