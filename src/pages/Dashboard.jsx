import { useEffect, useState } from "react";
import API from "../Services/api";

const statusClass = {
  Delivered:  "badge-success",
  Processing: "badge-info",
  Pending:    "badge-warning",
  Cancelled:  "badge-danger",
  Shipped:    "badge-info",
};

function getRelativeTime(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  
  if (isNaN(date.getTime())) return dateString;

  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hr${diffHours > 1 ? "s" : ""} ago`;
  if (diffDays < 30) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
  
  return date.toLocaleDateString();
}

function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let active = true;
    const fetchDashboard = async () => {
      try {
        const res = await API.get("/admin/dashboard");
        if (active) {
          setData(res.data);
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
        if (active) {
          setError("Failed to load dashboard data. Please make sure the backend server is running.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };
    fetchDashboard();
    return () => { active = false; };
  }, []);

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner" />
        <span>Loading dashboard...</span>
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

  const stats = [
    { icon: "💰", label: "Total Revenue",  value: data?.stats?.totalRevenue || "$0.00", badge: "Live", trend: "up",   color: "purple" },
    { icon: "🛒", label: "Total Orders",   value: data?.stats?.totalOrders || "0",      badge: "Live", trend: "up",   color: "blue"   },
    { icon: "📦", label: "Products",       value: data?.stats?.totalProducts || "0",    badge: "Live", trend: "up",   color: "green"  },
    { icon: "👥", label: "Total Users",    value: data?.stats?.totalUsers || "0",       badge: "Live", trend: "up",   color: "amber"  },
  ];

  return (
    <>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Here's what's happening with your store today.</p>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {stats.map((s) => (
          <div key={s.label} className="stat-card">
            <div className={`stat-icon ${s.color}`}>{s.icon}</div>
            <div className="stat-info">
              <h3>{s.value}</h3>
              <p>{s.label}</p>
              <span className={`stat-badge ${s.trend}`}>{s.badge}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: "20px" }}>

        {/* Recent Orders */}
        <div className="table-container">
          <div className="table-header">
            <h2>Recent Orders</h2>
            <a href="/orders" style={{ fontSize: "0.8rem", color: "var(--accent)", textDecoration: "none" }}>
              View all →
            </a>
          </div>
          <table>
            <thead>
              <tr>
                <th>Order</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Amount</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {data?.recentOrders?.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: "center", padding: "32px", color: "var(--text-muted)" }}>
                    No orders placed yet.
                  </td>
                </tr>
              ) : (
                data?.recentOrders?.map((o) => (
                  <tr key={o.id}>
                    <td><span style={{ color: "var(--accent)", fontWeight: 600 }}>{o.id}</span></td>
                    <td>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div className="avatar" style={{ width: 28, height: 28, fontSize: "0.65rem" }}>
                          {o.customer.slice(0, 2).toUpperCase()}
                        </div>
                        {o.customer}
                      </div>
                    </td>
                    <td>
                      <div style={{ maxWidth: "220px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={o.product}>
                        {o.product}
                      </div>
                    </td>
                    <td style={{ fontWeight: 600 }}>{o.amount}</td>
                    <td><span className={`badge ${statusClass[o.status] || "badge-info"}`}>{o.status}</span></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <h2 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "16px" }}>Recent Activity</h2>
          {data?.recentActivity?.length === 0 ? (
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", textAlign: "center", padding: "32px 0" }}>
              No recent activity.
            </p>
          ) : (
            data?.recentActivity?.map((a, i) => (
              <div key={i} className="activity-item">
                <span className={`activity-dot ${a.dot}`} />
                <div className="activity-info">
                  <p>{a.text}</p>
                  <span>{getRelativeTime(a.time)}</span>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </>
  );
}

export default Dashboard;