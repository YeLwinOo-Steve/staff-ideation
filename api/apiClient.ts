import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.BASE_URL,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || "Something went wrong";

    return Promise.reject(error);
  },
);

export default apiClient;
