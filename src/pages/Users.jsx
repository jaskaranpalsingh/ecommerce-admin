import { useState } from "react";

const initialUsers = [
  { id: 1, name: "Arjun Mehta", email: "arjun.mehta@example.com", role: "Customer", status: "Active", spent: "$450.00", joined: "12 May 2026" },
  { id: 2, name: "Priya Sharma", email: "priya.s@example.com", role: "Customer", status: "Active", spent: "$890.00", joined: "15 May 2026" },
  { id: 3, name: "Rahul Singh", email: "rahul.singh@example.com", role: "Customer", status: "Inactive", spent: "$120.50", joined: "18 May 2026" },
  { id: 4, name: "Neha Kapoor", email: "neha.k@example.com", role: "Customer", status: "Active", spent: "$55.00", joined: "20 May 2026" },
  { id: 5, name: "Vikram Patel", email: "vikram.p@example.com", role: "Customer", status: "Blocked", spent: "$0.00", joined: "22 May 2026" },
  { id: 6, name: "Ananya Gupta", email: "ananya.g@example.com", role: "Customer", status: "Active", spent: "$1,200.00", joined: "25 May 2026" },
  { id: 7, name: "Ravi Kumar", email: "ravi.k@example.com", role: "Customer", status: "Active", spent: "$44.00", joined: "28 May 2026" },
];

const statusClass = {
  Active: "badge-success",
  Inactive: "badge-warning",
  Blocked: "badge-danger",
};

function Users() {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase())
  );

  const toggleStatus = (id) => {
    setUsers(
      users.map((u) => {
        if (u.id === id) {
          const nextStatus = u.status === "Active" ? "Blocked" : "Active";
          return { ...u, status: nextStatus };
        }
        return u;
      })
    );
  };

  const deleteUser = (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      setUsers(users.filter((u) => u.id !== id));
    }
  };

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
                        {user.name.slice(0, 2).toUpperCase()}
                      </div>
                      <span style={{ fontWeight: 600 }}>{user.name}</span>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <span className="badge badge-purple">{user.role}</span>
                  </td>
                  <td>
                    <span className={`badge ${statusClass[user.status]}`}>{user.status}</span>
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
