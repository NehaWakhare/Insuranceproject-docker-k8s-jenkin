// src/api/superAdminApi.js

const API_BASE_URL = " http://localhost:8089/api/admin/login"; // your backend base URL

// 🔹 Super Admin login API
export async function superAdminLogin(email, password) {
  const response = await fetch("http://localhost:8089/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    throw new Error("Invalid super admin credentials");
  }

  return response.json(); // returns { token, role }
}

// 🔹 Example: Get all pending approvals (optional for later use)
export async function getPendingApprovals() {
  const token = localStorage.getItem("token");
  const response = await fetch(`${API_BASE_URL}/superadmin/approvals`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Failed to fetch approvals");
  }

  return response.json();
}
