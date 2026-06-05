import { useEffect, useState } from "react";
import API from "../Services/api";

const statusClass = {
  Delivered:  "badge-success",
  Processing: "badge-info",
  Pending:    "badge-warning",
  Cancelled:  "badge-danger",
  Shipped:    "badge-purple", // Shipped is colored purple
};

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("All");

  const filters = ["All", "Processing", "Shipped", "Delivered", "Cancelled"];

  useEffect(() => {
    let active = true;
    const fetchOrders = async () => {
      try {
        const res = await API.get("/admin/orders");
        if (active) {
          setOrders(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        if (active) {
          setError("Failed to fetch orders. Make sure the backend server is running.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };
    fetchOrders();
    return () => { active = false; };
  }, []);

  const updateStatus = async (id, newStatus) => {
    try {
      await API.put(`/admin/orders/${id}/status`, { status: newStatus });
      setOrders(orders.map((o) => (o.id === id ? { ...o, status: newStatus } : o)));
    } catch (err) {
      console.error("Failed to update status:", err);
      alert("Failed to update order status. Please try again.");
    }
  };

  const filtered = filter === "All"
    ? orders
    : orders.filter((o) => o.status === filter);

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner" />
        <span>Loading orders...</span>
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
        <h1>Orders</h1>
        <p>Track and manage all customer orders.</p>
      </div>

      {/* Filter tabs */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "20px", flexWrap: "wrap" }}>
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`btn btn-sm ${filter === f ? "btn-primary" : "btn-ghost"}`}
          >
            {f}
            <span style={{
              marginLeft: "6px", background: "rgba(255,255,255,0.15)",
              padding: "1px 7px", borderRadius: "10px", fontSize: "0.7rem"
            }}>
              {f === "All" ? orders.length : orders.filter((o) => o.status === f).length}
            </span>
          </button>
        ))}
      </div>

      <div className="table-container">
        <div className="table-header">
          <h2>Orders ({filtered.length})</h2>
        </div>
        
        {filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📦</div>
            <p>No orders found in this category.</p>
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Product</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((o) => (
                <tr key={o.id}>
                  <td><span style={{ color: "var(--accent)", fontWeight: 600 }}>{o.orderIdString}</span></td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div className="avatar" style={{ width: 28, height: 28, fontSize: "0.65rem" }}>
                        {(o.customer || "CU").slice(0, 2).toUpperCase()}
                      </div>
                      {o.customer}
                    </div>
                  </td>
                  <td>
                    <div style={{ maxWidth: "240px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={o.product}>
                      {o.product}
                    </div>
                  </td>
                  <td style={{ fontWeight: 700 }}>{o.amount}</td>
                  <td style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>{o.date}</td>
                  <td>
                    <span className={`badge ${statusClass[o.status] || "badge-info"}`}>{o.status}</span>
                  </td>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <select
                        value={o.status}
                        onChange={(e) => updateStatus(o.id, e.target.value)}
                        style={{
                          padding: "4px 8px",
                          borderRadius: "var(--radius-sm)",
                          border: "1px solid var(--border)",
                          background: "var(--bg-secondary)",
                          color: "var(--text-primary)",
                          fontSize: "0.75rem",
                          fontWeight: 600,
                          outline: "none",
                          cursor: "pointer"
                        }}
                      >
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
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

export default Orders;
