import axios from "axios";

// const BASE_URL = "https://vstu.et:4001/api";
// const BASE_URL = "https://vstu.et:5059/api";     
const BASE_URL = "https://api.vstu.et:4003/api";
// const API_BASE_URL = "http://localhost:5000/api";

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

// export const apiClients = axios.create({
//   baseURL: API_BASE_URL,
//   headers: { "Content-Type": "application/json" },
//   withCredentials: true,
// });