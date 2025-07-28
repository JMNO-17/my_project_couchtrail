import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
});

// Add token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  console.error("Interceptor request error:", error);
  return Promise.reject(error);
});

// Optional: Log response errors
API.interceptors.response.use(
  response => response,
  error => {
    console.error("API Error:", error.response || error.message);
    return Promise.reject(error);
  }
);

export default API;


