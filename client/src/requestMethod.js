import axios from "axios";

export const makeRequest = axios.create({
  baseURL: "http://localhost:8080/api/",
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
