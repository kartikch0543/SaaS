import axios from "axios";

const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, "");
const fallbackBaseUrl = import.meta.env.DEV ? "http://localhost:5000" : "";

const apiClient = axios.create({
  baseURL: configuredBaseUrl || fallbackBaseUrl,
  headers: {
    "Content-Type": "application/json"
  },
  timeout: 15000
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("studyforge_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default apiClient;
