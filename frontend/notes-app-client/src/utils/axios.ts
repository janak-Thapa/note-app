// axiosInstance.ts
import axios from "axios";
import { config } from "./constants"; // Adjust the path if necessary

const axiosInstance = axios.create({
    baseURL: config.base_url, // Accessing the base_url property directly
    timeout: 10000,
    headers: {
        "Content-Type": "application/json"
    },
});

axiosInstance.interceptors.request.use(
    (config) => {
        const accessToken = localStorage.getItem("token");

        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
