import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:5000/",
  headers: {
    "Content-type": "application/json",
  },
  timeout: 10000,
});

export default apiClient;
