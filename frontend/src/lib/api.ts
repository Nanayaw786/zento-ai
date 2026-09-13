const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8001";

export async function getBusinesses() {
  const res = await fetch(`${API_BASE_URL}/businesses/`);
  if (!res.ok) throw new Error("Failed to fetch businesses");
  return res.json();
}

export async function getCustomers(businessId: string) {
  const res = await fetch(`${API_BASE_URL}/customers/?business_id=${businessId}`);
  if (!res.ok) throw new Error("Failed to fetch customers");
  return res.json();
}

export async function createCustomer(data: {
  business_id: string;
  name: string;
  phone?: string;
  email?: string;
}) {
  const res = await fetch(`${API_BASE_URL}/customers/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create customer");
  return res.json();
}

export async function updateCustomer(
  customerId: string,
  data: { business_id: string; name: string; phone?: string; email?: string }
) {
  const res = await fetch(`${API_BASE_URL}/customers/${customerId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update customer");
  return res.json();
}

export async function deleteCustomer(customerId: string, businessId: string) {
  const res = await fetch(
    `${API_BASE_URL}/customers/${customerId}?business_id=${businessId}`,
    { method: "DELETE" }
  );
  if (!res.ok) throw new Error("Failed to delete customer");
  return res.json();
}

export async function getOrders(businessId: string) {
  const res = await fetch(`${API_BASE_URL}/orders/?business_id=${businessId}`);
  if (!res.ok) throw new Error("Failed to fetch orders");
  return res.json();
}

export async function createOrder(data: {
  business_id: string;
  customer_id: string;
  total: number;
  status: string;
}) {
  const res = await fetch(`${API_BASE_URL}/orders/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create order");
  return res.json();
}

export async function updateOrderStatus(orderId: string, businessId: string, status: string) {
  const res = await fetch(`${API_BASE_URL}/orders/${orderId}/status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ business_id: businessId, status }),
  });
  if (!res.ok) throw new Error("Failed to update order status");
  return res.json();
}

export async function getConversations(businessId: string) {
  const res = await fetch(`${API_BASE_URL}/conversations/?business_id=${businessId}`);
  if (!res.ok) throw new Error("Failed to fetch conversations");
  return res.json();
}

export async function getAppointments(businessId: string) {
  const res = await fetch(`${API_BASE_URL}/appointments/?business_id=${businessId}`);
  if (!res.ok) throw new Error("Failed to fetch appointments");
  return res.json();
}

export async function getProducts(businessId: string) {
  const res = await fetch(`${API_BASE_URL}/products/?business_id=${businessId}`);
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

export async function createProduct(data: {
  business_id: string;
  name: string;
  description?: string;
  price: number;
  is_available: boolean;
}) {
  const res = await fetch(`${API_BASE_URL}/products/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create product");
  return res.json();
}

export async function updateProduct(
  productId: string,
  data: {
    business_id: string;
    name: string;
    description?: string;
    price: number;
    is_available: boolean;
  }
) {
  const res = await fetch(`${API_BASE_URL}/products/${productId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update product");
  return res.json();
}

export async function deleteProduct(productId: string, businessId: string) {
  const res = await fetch(
    `${API_BASE_URL}/products/${productId}?business_id=${businessId}`,
    { method: "DELETE" }
  );
  if (!res.ok) throw new Error("Failed to delete product");
  return res.json();
}

export async function signup(data: {
  name: string;
  email: string;
  password: string;
  business_type?: string;
}) {
  const res = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.detail ?? "Signup failed");
  }
  return res.json();
}

export async function login(data: { email: string; password: string }) {
  const res = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => null);
    throw new Error(err?.detail ?? "Login failed");
  }
  return res.json();
}

export async function sendChatMessage(
  businessId: string,
  message: string,
  history: { role: "user" | "assistant"; content: string }[] = []
) {
  const res = await fetch(`${API_BASE_URL}/agent/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ business_id: businessId, message, history }),
  });
  if (!res.ok) {
    throw new Error("Failed to get a response from the assistant");
  }
  return res.json();
}
export async function getNotifications(businessId: string) {
  const res = await fetch(`${API_BASE_URL}/notifications/?business_id=${businessId}`);
  if (!res.ok) throw new Error("Failed to fetch notifications");
  return res.json();
}

export async function markNotificationRead(notificationId: string, businessId: string) {
  const res = await fetch(
    `${API_BASE_URL}/notifications/${notificationId}/read?business_id=${businessId}`,
    { method: "PUT" }
  );
  if (!res.ok) throw new Error("Failed to mark notification as read");
  return res.json();
}

export async function markAllNotificationsRead(businessId: string) {
  const res = await fetch(
    `${API_BASE_URL}/notifications/mark-all-read?business_id=${businessId}`,
    { method: "PUT" }
  );
  if (!res.ok) throw new Error("Failed to mark all as read");
  return res.json();
}

export async function getBusiness(businessId: string) {
  const res = await fetch(`${API_BASE_URL}/businesses/${businessId}`);
  if (!res.ok) throw new Error("Failed to fetch business");
  return res.json();
}

export async function updateBusiness(
  businessId: string,
  data: { name: string; phone?: string; business_type?: string }
) {
  const res = await fetch(`${API_BASE_URL}/businesses/${businessId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update business");
  return res.json();
}

export async function adminLogin(username: string, password: string) {
  const res = await fetch(`${API_BASE_URL}/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });
  if (!res.ok) {
    throw new Error("Invalid admin credentials");
  }
  return res.json();
}

export async function getAdminStats(token: string) {
  const res = await fetch(`${API_BASE_URL}/admin/stats`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch admin stats");
  return res.json();
}

export async function getAdminBusinesses(token: string) {
  const res = await fetch(`${API_BASE_URL}/admin/businesses`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error("Failed to fetch businesses");
  return res.json();
}

export async function requestWhatsAppNumber(businessId: string, number: string) {
  const res = await fetch(`${API_BASE_URL}/businesses/${businessId}/whatsapp-request`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ whatsapp_requested_number: number }),
  });
  if (!res.ok) throw new Error("Failed to submit WhatsApp number request");
  return res.json();
}
