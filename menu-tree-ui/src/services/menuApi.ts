import axios from "axios";
import { requireEnv } from "@/utils/string";

const API =
  requireEnv(process.env.NEXT_PUBLIC_API_URL, "NEXT_PUBLIC_API_URL") +
  "/api/v1/menu";

export const getMenus = () => axios.get(API);
export const createMenu = (data: any) => axios.post(API, data);
export const updateMenu = (id: string, data: any) =>
  axios.put(`${API}/${id}`, data);
export const deleteMenu = (id: string) => axios.delete(`${API}/${id}`);
