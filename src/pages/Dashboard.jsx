const stats = [
  { icon: "💰", label: "Total Revenue",  value: "$48,295", badge: "+12.5%", trend: "up",   color: "purple" },
  { icon: "🛒", label: "Total Orders",   value: "1,284",   badge: "+8.1%",  trend: "up",   color: "blue"   },
  { icon: "📦", label: "Products",       value: "340",     badge: "+4",     trend: "up",   color: "green"  },
  { icon: "👥", label: "Total Users",    value: "5,923",   badge: "+21%",   trend: "up",   color: "amber"  },
];

const recentOrders = [
  { id: "#ORD-001", customer: "Arjun Mehta",    product: "Black Hoodie",      amount: "$49.99",  status: "Delivered" },
  { id: "#ORD-002", customer: "Priya Sharma",   product: "Running Shoes",     amount: "$89.00",  status: "Processing"},
  { id: "#ORD-003", customer: "Rahul Singh",    product: "Slim Fit Jeans",    amount: "$39.99",  status: "Pending"   },
  { id: "#ORD-004", customer: "Neha Kapoor",    product: "Floral Dress",      amount: "$55.00",  status: "Delivered" },
  { id: "#ORD-005", customer: "Vikram Patel",   product: "Sports T-shirt",    amount: "$24.99",  status: "Cancelled" },
];

const activity = [
  { dot: "green",  text: "New order received from Arjun Mehta",  time: "2 min ago" },
  { dot: "purple", text: "Product 'Black Hoodie' stock updated",  time: "18 min ago"},
  { dot: "amber",  text: "Review posted on 'Running Shoes'",      time: "1 hr ago"  },
  { dot: "green",  text: "New user registered: Priya Sharma",     time: "2 hr ago"  },
  { dot: "red",    text: "Order #ORD-005 was cancelled",          time: "3 hr ago"  },
];

const statusClass = {
  Delivered:  "badge-success",
  Processing: "badge-info",
  Pending:    "badge-warning",
  Cancelled:  "badge-danger",
};

function Dashboard() {
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
              <span className={`stat-badge ${s.trend}`}>{s.badge} this month</span>
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
              {recentOrders.map((o) => (
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
                  <td>{o.product}</td>
                  <td style={{ fontWeight: 600 }}>{o.amount}</td>
                  <td><span className={`badge ${statusClass[o.status]}`}>{o.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Recent Activity */}
        <div className="card">
          <h2 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "16px" }}>Recent Activity</h2>
          {activity.map((a, i) => (
            <div key={i} className="activity-item">
              <span className={`activity-dot ${a.dot}`} />
              <div className="activity-info">
                <p>{a.text}</p>
                <span>{a.time}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </>
  );
}

export default Dashboard;