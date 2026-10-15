import axios from "axios";

// Standard Axios instance with withCredentials: true so cookies are sent automatically
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor for friendly error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.message ||
      error.message ||
      "An unexpected network error occurred";
    return Promise.reject(new Error(message));
  }
);

// Customer / Auth Services
export const customerAPI = {
  register: (userData) => api.post("/customers/register", userData),
  login: (credentials) => api.post("/customers/login", credentials),
  getMe: () => api.get("/customers/me"),
  logout: () => api.post("/customers/logout"),
  changePassword: (passwords) => api.patch("/customers/change-password", passwords),
};

// Product Services
export const productAPI = {
  getProducts: (params = {}) => api.get("/products", { params }),
  getProductById: (id) => api.get(`/products/${id}`),
  createProduct: (data) => api.post("/products", data),
};

// Wishlist Services
export const wishlistAPI = {
  getWishlist: () => api.get("/wishlist"),
  addToWishlist: (productId) => api.post(`/wishlist/${productId}`),
  removeFromWishlist: (productId) => api.delete(`/wishlist/${productId}`),
  toggleWishlist: (productId) => api.patch(`/wishlist/${productId}/toggle`),
};

// Cart Services
export const cartAPI = {
  getCart: () => api.get("/cart"),
  addToCart: (productId) => api.post(`/cart/${productId}`),
  updateQuantity: (productId, quantity) => api.patch(`/cart/${productId}`, { quantity }),
  removeFromCart: (productId) => api.delete(`/cart/${productId}`),
};

// Order & Payment Services
export const orderAPI = {
  createPaymentOrder: (shippingAddress) => api.post("/orders/create-payment-order", { shippingAddress }),
  verifyPayment: (paymentDetails) => api.post("/orders/verify-payment", paymentDetails),
  getMyOrders: () => api.get("/orders"),
  getOrderById: (id) => api.get(`/orders/${id}`),
  updateStatus: (id, status) => api.patch(`/orders/${id}/status`, { status }),
};

export default api;
