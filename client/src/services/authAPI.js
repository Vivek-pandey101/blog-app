import axios from "axios";

const API = axios.create({ baseURL: "https://blog-app-1-gqul.onrender.com/api" });

export const register = (formData) => API.post("/auth/register", formData);
export const login = (formData) => API.post("/auth/login", formData);

