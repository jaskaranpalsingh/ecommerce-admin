import { useEffect, useState } from "react";
import API from "../Services/api";

const statusClass = {
  Active: "badge-success",
  Inactive: "badge-warning",
  Blocked: "badge-danger",
};

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let active = true;
    const fetchUsers = async () => {
      try {
        const res = await API.get("/admin/users");
        if (active) {
          setUsers(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch users:", err);
        if (active) {
          setError("Failed to fetch users. Make sure the backend server is running.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };
    fetchUsers();
    return () => { active = false; };
  }, []);

  const filteredUsers = users.filter(
    (user) =>
      (user.name || "").toLowerCase().includes(search.toLowerCase()) ||
      (user.email || "").toLowerCase().includes(search.toLowerCase())
  );

  const toggleStatus = async (id) => {
    try {
      const res = await API.put(`/admin/users/${id}/toggle-block`);
      // Update local state with returned status
      setUsers(
        users.map((u) => {
          if (u.id === id) {
            return { ...u, status: res.data.user.status };
          }
          return u;
        })
      );
    } catch (err) {
      console.error("Failed to toggle status:", err);
      alert("Failed to update user block status. Please try again.");
    }
  };

  const deleteUser = async (id) => {
    if (window.confirm("Are you sure you want to delete this user? This will permanently remove their account.")) {
      try {
        await API.delete(`/admin/users/${id}`);
        setUsers(users.filter((u) => u.id !== id));
      } catch (err) {
        console.error("Failed to delete user:", err);
        alert("Failed to delete user. Please try again.");
      }
    }
  };

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner" />
        <span>Loading users...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="empty-state">
        <div className="empty-icon">⚠️</div>
        <p style={{ color: "var(--danger)" }}>{error}</p>
      </div>
    );
  }

  return (
    <>
      <div className="page-header">
        <h1>Users</h1>
        <p>Manage customer accounts, roles, and status.</p>
      </div>

      <div className="table-container">
        <div className="table-header">
          <h2>All Users ({filteredUsers.length})</h2>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <div className="search-bar">
              <span className="search-icon">🔍</span>
              <input
                type="text"
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">👥</div>
            <p>No users found matching your search.</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Total Spent</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div className="avatar" style={{ width: 32, height: 32, fontSize: "0.75rem" }}>
                        {(user.name || "US").slice(0, 2).toUpperCase()}
                      </div>
                      <span style={{ fontWeight: 600 }}>{user.name}</span>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <span className="badge badge-purple">{user.role}</span>
                  </td>
                  <td>
                    <span className={`badge ${statusClass[user.status] || "badge-info"}`}>{user.status}</span>
                  </td>
                  <td style={{ fontWeight: 600 }}>{user.spent}</td>
                  <td style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>{user.joined}</td>
                  <td>
                    <div style={{ display: "flex", gap: "8px" }}>
                      <button
                        className="btn btn-ghost btn-sm"
                        onClick={() => toggleStatus(user.id)}
                      >
                        {user.status === "Active" ? "🚫 Block" : "✅ Activate"}
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => deleteUser(user.id)}
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

export default Users;
