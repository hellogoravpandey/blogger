import { useEffect, useState } from "react";
import { getAdminDashboard, getAdminUsers, updateUserRole } from "../admin.api";

const statItems = [
  ["totalUsers", "Users"],
  ["totalBlogs", "Blogs"],
  ["totalComments", "Comments"],
  ["totalAssets", "Assets"],
  ["newUsersToday", "New users today"],
  ["newBlogsToday", "New blogs today"],
];

function AdminDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadUsers = async (value = search) => {
    const data = await getAdminUsers(value);
    setUsers(data.users || []);
  };

  useEffect(() => {
    Promise.all([getAdminDashboard(), getAdminUsers()])
      .then(([data, userData]) => {
        setDashboard(data);
        setUsers(userData.users || []);
      })
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, []);

  const handleRoleChange = async (userId, role) => {
    try {
      const data = await updateUserRole(userId, role);
      setUsers((current) => current.map((user) => user._id === userId ? { ...user, role: data.user.role } : user));
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  if (loading) return <main className="mx-auto max-w-7xl px-3 py-8 sm:px-6 lg:px-8">Loading admin dashboard...</main>;

  return (
    <main className="min-h-[calc(100vh-73px)] bg-gray-50 px-3 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <p className="text-sm font-medium text-gray-500">Administration</p>
          <h1 className="mt-1 text-3xl font-bold text-gray-900">Admin dashboard</h1>
          <p className="mt-2 text-gray-600">Platform overview and user access management.</p>
        </div>
        {error && <p className="mb-5 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">{error}</p>}

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {statItems.map(([key, label]) => (
            <article key={key} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <p className="text-sm text-gray-500">{label}</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{dashboard?.stats?.[key] ?? 0}</p>
            </article>
          ))}
        </section>

        <section className="mt-8 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">Users</h2>
              <p className="mt-1 text-sm text-gray-500">Manage roles from the server-authorized user list.</p>
            </div>
            <input value={search} onChange={(event) => setSearch(event.target.value)} onKeyDown={(event) => event.key === "Enter" && loadUsers()} placeholder="Search users" className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900" />
          </div>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-150 text-left text-sm">
              <thead className="border-b border-gray-200 text-gray-500"><tr><th className="px-3 py-3">User</th><th className="px-3 py-3">Email</th><th className="px-3 py-3">Role</th><th className="px-3 py-3">Created</th></tr></thead>
              <tbody>{users.map((user) => <tr key={user._id} className="border-b border-gray-100 last:border-0"><td className="px-3 py-3 font-medium text-gray-900">{user.username}</td><td className="px-3 py-3 text-gray-600">{user.email}</td><td className="px-3 py-3"><select value={user.role} onChange={(event) => handleRoleChange(user._id, event.target.value)} className="rounded border border-gray-300 px-2 py-1"><option value="USER">USER</option><option value="ADMIN">ADMIN</option></select></td><td className="px-3 py-3 text-gray-500">{new Date(user.createdAt).toLocaleDateString()}</td></tr>)}</tbody>
            </table>
          </div>
        </section>
      </div>
    </main>
  );
}

export default AdminDashboard;