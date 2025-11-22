import axios from "axios";

const API_URL = "http://localhost:4000/api";

interface LoginResponse {
  token: string;
  user: {
    id: string;
    email: string;
    role: "admin" | "editor";
  };
}

export const loginRequest = async (email: string, password: string): Promise<LoginResponse> => {
  const res = await axios.post(`${API_URL}/auth/login`, { email, password });
  return res.data;
};
