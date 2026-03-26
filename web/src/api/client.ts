import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://todo-project-7488.onrender.com', // Endpoints do Node.js
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para injetar o Token em todas as chamadas Auth
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
