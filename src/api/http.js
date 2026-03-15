import axios from "axios";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "https://thumbnail-generator-backend-3.onrender.com"

const http = axios.create({
  baseURL: apiBaseUrl
});

export default http;

