import axios from "axios";
import { jwtDecode } from "jwt-decode";
import * as util from "./API_CONSTANT";

export const axiosInstance = axios.create({
    baseURL: util.BASE_URL,
    headers: {
        "Content-Type": "application/json",
        "Accept": "*/*",
    },
    timeout: 30000,
});

// Function to check if token is expired
const isTokenExpired = (token) => {
    if (!token) return true;
    try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        return decoded.exp < currentTime;
    } catch (error) {
        console.error("Error decoding token: ", error);
        return true;
    }
};

// Request interceptor to attach token and check expiry
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            if (isTokenExpired(token)) {
                console.log("Token is expired");
            } else {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        console.log("I am in the middleware of the request instance");
        return config;
    },
    (error) => {
        console.error("Request error: ", error);
        return Promise.reject(error);
    }
);

// Response interceptor for handling responses, error responses, etc.
axiosInstance.interceptors.response.use(
    (response) => {
        console.log("Response: MiddleWare::", response.data);
        return response;
    },
    (error) => {
        console.error("Response error: ", error);
        return Promise.reject(error);
    }
);

export default axiosInstance;
