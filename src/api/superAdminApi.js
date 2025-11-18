import CONFIG from "../config/config";

const API_BASE_URL = `${CONFIG.BASE_URL}/api`;

export function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return token
    ? { "Content-Type": "application/json", Authorization: `Bearer ${token}` }
    : { "Content-Type": "application/json" };
}

export async function superAdminLogin(email, password) {
  const response = await fetch(`${API_BASE_URL}/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error("Invalid super admin credentials");
  }

  return response.json();
}

export async function fetchAllAdmins() {
  const response = await fetch(`${API_BASE_URL}/admin/all`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) throw new Error("Failed to fetch admin list");
  return response.json();
}

export async function fetchPendingAdmins() {
  const response = await fetch(`${API_BASE_URL}/admin/pending`, {
    method: "GET",
    headers: getAuthHeaders(),
  });

  if (!response.ok) throw new Error("Failed to fetch pending admins");
  return response.json();
}

export async function approveAdmin(id) {
  const response = await fetch(`${API_BASE_URL}/admin/approve/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
  });

  if (!response.ok) throw new Error("Failed to approve admin");
  return response.text();
}

export async function rejectAdmin(id) {
  const response = await fetch(`${API_BASE_URL}/admin/reject/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
  });

  if (!response.ok) throw new Error("Failed to reject admin");
  return response.text();
}
