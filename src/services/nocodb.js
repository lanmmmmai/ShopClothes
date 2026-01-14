import axios from "axios";

/**
 * NocoDB data API client (through backend API)
 * Token is stored in httpOnly cookie, backend handles authentication
 */
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export const nocodb = axios.create({
  baseURL: `${API_BASE_URL}/nocodb`,
  withCredentials: true, // Send cookies with requests
  headers: {
    "Content-Type": "application/json",
  },
});
