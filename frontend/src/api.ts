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

// Locations
export type LocationPayload = {
  name: string;
  warehouse_id?: number;
};
export const getLocations = (warehouseId: number) => api.get(`/warehouses/${warehouseId}/locations`);
export const createLocation = (warehouseId: number, loc: LocationPayload) => api.post(`/warehouses/${warehouseId}/locations`, { ...loc, warehouse_id: warehouseId });
export const updateLocation = (id: number, loc: Partial<LocationPayload>) => api.put(`/warehouses/locations/${id}`, loc);
export const deleteLocation = (id: number) => api.delete(`/warehouses/locations/${id}`);

// Stats
export const getStats = () => api.get("/stats");

export const getProducts = () => api.get("/products");
export type ProductPayload = {
  name: string;
  sku: string;
  uom: string;
  category_id?: number | null;
  description?: string | null;
  initial_stock?: number;
  reorder_point?: number;
};
export const createProduct = (product: ProductPayload) => api.post("/products", product);
export const updateProduct = (id: number, product: Partial<ProductPayload>) => api.put(`/products/${id}`, product);
export const deleteProduct = (id: number) => api.delete(`/products/${id}`);

// Stock Moves - Receipts
export const getReceipts = () => api.get("/stock-moves/receipts");
export const createReceipt = (data: any) => api.post("/stock-moves/receipts", data);
export const getReceipt = (id: number) => api.get(`/stock-moves/receipts/${id}`);
export const validateReceipt = (id: number) => api.post(`/stock-moves/receipts/${id}/validate`, {});
export const deleteReceipt = (id: number) => api.delete(`/stock-moves/receipts/${id}`);

// Stock Moves - Deliveries
export const getDeliveries = () => api.get("/stock-moves/deliveries");
export const createDelivery = (data: any) => api.post("/stock-moves/deliveries", data);
export const getDelivery = (id: number) => api.get(`/stock-moves/deliveries/${id}`);
export const validateDelivery = (id: number) => api.post(`/stock-moves/deliveries/${id}/validate`, {});
export const deleteDelivery = (id: number) => api.delete(`/stock-moves/deliveries/${id}`);

// Stock Moves - Transfers
export const getTransfers = () => api.get("/stock-moves/transfers");
export const createTransfer = (data: any) => api.post("/stock-moves/transfers", data);
export const getTransfer = (id: number) => api.get(`/stock-moves/transfers/${id}`);
export const validateTransfer = (id: number) => api.post(`/stock-moves/transfers/${id}/validate`, {});
export const deleteTransfer = (id: number) => api.delete(`/stock-moves/transfers/${id}`);

// Stock Moves - Adjustments
export const getAdjustments = () => api.get("/stock-moves/adjustments");
export const createAdjustment = (data: any) => api.post("/stock-moves/adjustments", data);
export const getAdjustment = (id: number) => api.get(`/stock-moves/adjustments/${id}`);
export const validateAdjustment = (id: number) => api.post(`/stock-moves/adjustments/${id}/validate`, {});
export const deleteAdjustment = (id: number) => api.delete(`/stock-moves/adjustments/${id}`);

// Stock Moves - History/Ledger
export const getMoveHistory = () => api.get("/stock-moves/ledger");
export const getLowStockItems = () => api.get("/stock-moves/low-stock");
