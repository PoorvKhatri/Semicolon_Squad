import axios from "axios";

const API_URL = "http://localhost:8000/api";

const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const loginToken = (identifier: string, password: string) => {
  const params = new URLSearchParams();
  params.append("username", identifier);
  params.append("password", password);
  return api.post("/auth/token", params, {
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
  });
};

export const registerUser = (email: string, password: string, username: string, full_name?: string | null) => {
  // backend expects: { username, email, password, full_name? }
  return api.post("/auth/register", {
    username,
    email,
    password,
    full_name: full_name ?? null,
  });
};

export const requestPasswordReset = (email: string) => api.post("/auth/forgot-password", { email });
export const resetPassword = (token: string, password: string) => api.post("/auth/reset-password", { token, password });
export const getMe = () => api.get("/auth/me");

// Warehouses
export type WarehousePayload = {
  name: string;
  description?: string | null;
};
export const getWarehouses = () => api.get("/warehouses");
export const createWarehouse = (wh: WarehousePayload) => api.post("/warehouses", wh);
export const updateWarehouse = (id: number, wh: Partial<WarehousePayload>) => api.put(`/warehouses/${id}`, wh);
export const deleteWarehouse = (id: number) => api.delete(`/warehouses/${id}`);

// Stats
export const getStats = () => api.get("/stats");

export const getProducts = () => api.get("/products");
export type ProductPayload = {
  name: string;
  sku: string;
  uom: string;
  category_id?: number | null;
  description?: string | null;
};
export const createProduct = (product: ProductPayload) => api.post("/products", product);
export const updateProduct = (id: number, product: Partial<ProductPayload>) => api.put(`/products/${id}`, product);
export const deleteProduct = (id: number) => api.delete(`/products/${id}`);
