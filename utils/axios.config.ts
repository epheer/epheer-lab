import axios from "axios";

const api = axios.create({
  baseURL: "https://api.epheer.ru/v1/",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  config.headers.Authorization = `Bearer ${localStorage.getItem("token")}`;
  return config;
});

export { api };
