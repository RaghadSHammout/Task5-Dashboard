import axios from "axios";

const API = axios.create({
  baseURL: "https://web-production-3ca4c.up.railway.app/api",
  headers: {
    Accept: "application/json",
  },
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export const fetchItems = () => API.get("/items");


export default API;
