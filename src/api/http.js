import axios from "axios";

const apiBaseUrl = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000"
).replace(/\/$/, "");

const http = axios.create({
  baseURL: apiBaseUrl,
  // Default timeout: 30 seconds for regular API calls.
  // Individual calls (upload, generate) override this with longer values.
  timeout: 30_000
});

export default http;
