import axios from "axios";

const API = process.env.PRISM_API || "http://localhost:3333";
const TOKEN = process.env.PRISM_TOKEN || process.env.PRISM_API_TOKEN || "";

export const http = axios.create({
  baseURL: API,
  headers: TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {},
  timeout: 15000,
});
