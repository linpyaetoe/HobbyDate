import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000", // backend url
  withCredentials: true,  // cookies for auth
});

export default api;
