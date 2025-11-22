import axios from "axios";
import { Hero } from "../types/hero";

const API_URL = "http://localhost:4000/api";

export const fetchHeroes = async (params?: {
  q?: string;
  univers?: string;
}): Promise<Hero[]> => {
  const res = await axios.get(`${API_URL}/heroes`, { params });
  return res.data;
};

export const fetchHeroById = async (id: string): Promise<Hero> => {
  const res = await axios.get(`${API_URL}/heroes/${id}`);
  return res.data;
};

export const createHero = async (formData: FormData, token: string): Promise<Hero> => {
  const res = await axios.post(`${API_URL}/heroes`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data"
    }
  });
  return res.data;
};

export const updateHero = async (
  id: string,
  formData: FormData,
  token: string
): Promise<Hero> => {
  const res = await axios.put(`${API_URL}/heroes/${id}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data"
    }
  });
  return res.data;
};

export const deleteHero = async (id: string, token: string): Promise<void> => {
  await axios.delete(`${API_URL}/heroes/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
};
