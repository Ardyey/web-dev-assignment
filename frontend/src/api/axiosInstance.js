import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: '/api', // Assuming all API routes are prefixed with /api
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // Or however the token is stored
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
