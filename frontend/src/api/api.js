import axios from "axios";

const API = axios.create({
  baseURL: "https://job-board-app-v7hc.onrender.com",
});

export default API;
