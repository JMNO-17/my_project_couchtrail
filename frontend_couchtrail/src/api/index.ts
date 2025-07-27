import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL, // e.g., http://localhost:8000/api
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json'
  }
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  console.log(token, "FFFFFFFF");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default API;
