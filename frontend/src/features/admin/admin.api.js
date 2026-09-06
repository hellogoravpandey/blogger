import { apiFetch } from "../../services/api";

export const getAdminDashboard = () => apiFetch("/admin/dashboard");
export const getAdminUsers = (search = "") => apiFetch(`/admin/users?search=${encodeURIComponent(search)}`);
export const updateUserRole = (userId, role) => apiFetch(`/admin/users/${userId}/role`, {
  method: "PATCH",
  body: JSON.stringify({ role }),
});