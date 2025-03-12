import axios from "axios";

const BASE_URL = "https://vstu.et:4001/api";
// const BASE_URL = "https://vstu.et:5059/api";     
// const BASE_URL = "https://teletemari-backend-test-three.onrender.com";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
