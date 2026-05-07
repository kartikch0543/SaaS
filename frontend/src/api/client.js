import axios from "axios";

const configuredBaseUrl = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, "");
const fallbackBaseUrl = import.meta.env.DEV ? "http://localhost:5000" : "";

const apiClient = axios.create({
  baseURL: configuredBaseUrl || fallbackBaseUrl,
  headers: {
    "Content-Type": "application/json"
  },
  timeout: 20000
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("studyforge_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ECONNABORTED") {
      error.message = "The request took too long and timed out.";
    } else if (error.response?.data?.message) {
      error.message = error.response.data.message;
    } else if (!error.response) {
      error.message = "The server could not be reached.";
    }

    return Promise.reject(error);
  }
);

export default apiClient;
