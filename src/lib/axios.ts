import axios from "axios";

// const BASE_URL = "https://vstu.et:4001/api";
// const BASE_URL = "https://vstu.et:5059/api";
// const BASE_URL = "https://api.vstu.et:4003/api";
// Provided by VITE_API_BASE_URL (GitHub secret at CI build, or local .env)
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
// const BASE_URL = "https://con.vstu.et:2356";
// const BASE_URL = "https://dev.vstu.et:3456/api";
// const BASE_URL = "https://trial.vstu.et:2000/api";

// const API_BASE_URL = "http://localhost:5000/api";

if (!BASE_URL) {
  throw new Error("VITE_API_BASE_URL is not set. Add it to .env or pass it as a build arg.");
}

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
