import axios from "axios";

export const api = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_URL || process.env.API_URL || "https://api.melvin.my.id/"}/api/v1`,
});
