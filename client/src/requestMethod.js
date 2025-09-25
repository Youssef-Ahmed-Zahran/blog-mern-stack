import axios from "axios";

export const makeRequest = axios.create({
  baseURL: "https://blog-api-eight-brown.vercel.app/api/",
  withCredentials: true,
});

makeRequest.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
