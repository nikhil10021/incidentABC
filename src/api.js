// frontend/src/api.js

import axios from "axios";

// ---------------------------
// 1️⃣ API Base URL
// ---------------------------
// Make sure you have in your .env file:
// REACT_APP_API_URL=http://localhost:5000/api
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

// ---------------------------
// 2️⃣ Axios Instance
// ---------------------------
const API = axios.create({
  baseURL: API_BASE,
  timeout: 10000, // 10 seconds timeout
  headers: { "Content-Type": "application/json" },
});

// Interceptor: log errors
API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error?.response || error.message);
    return Promise.reject(error);
  }
);

// ---------------------------
// 3️⃣ API Functions
// ---------------------------

// Fetch all incidents with optional filters & pagination
export const fetchIncidents = (params = {}) => {
  return API.get("/incidents", { params });
};

// Fetch single incident by ID
export const fetchIncidentById = (id) => {
  if (!id) return Promise.reject("Incident ID is required");
  return API.get(`/incidents/${id}`);
};

// Create a new incident
export const createIncident = (data) => {
  if (!data.title || !data.severity)
    return Promise.reject("Title and Severity are required");
  return API.post("/incidents", data);
};

// Update the status of an incident
export const updateIncidentStatus = (id, status) => {
  if (!id || !status) return Promise.reject("ID and Status are required");
  return API.patch(`/incidents/${id}/status`, { status });
};

// Add a comment to an incident
export const addIncidentComment = (id, text) => {
  if (!id || !text) return Promise.reject("ID and Comment text are required");
  return API.post(`/incidents/${id}/comments`, { text });
};
