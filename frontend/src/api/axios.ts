import axios from "axios";

// Creamos la instancia de axios apuntando a tu backend
const api = axios.create({
  // Si estamos en Vercel, usará la URL de producción; si no, localhost
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:4000/api",
});
// Este interceptor añade el token automáticamente a cada petición
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;