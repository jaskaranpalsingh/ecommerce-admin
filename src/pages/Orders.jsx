import { useState } from "react";

const ordersData = [
  { id: "#ORD-001", customer: "Arjun Mehta",   product: "Black Hoodie",    amount: "$49.99", date: "01 Jun 2026", status: "Delivered"  },
  { id: "#ORD-002", customer: "Priya Sharma",  product: "Running Shoes",   amount: "$89.00", date: "01 Jun 2026", status: "Processing" },
  { id: "#ORD-003", customer: "Rahul Singh",   product: "Slim Fit Jeans",  amount: "$39.99", date: "31 May 2026", status: "Pending"    },
  { id: "#ORD-004", customer: "Neha Kapoor",   product: "Floral Dress",    amount: "$55.00", date: "30 May 2026", status: "Delivered"  },
  { id: "#ORD-005", customer: "Vikram Patel",  product: "Sports T-shirt",  amount: "$24.99", date: "30 May 2026", status: "Cancelled"  },
  { id: "#ORD-006", customer: "Ananya Gupta",  product: "Winter Jacket",   amount: "$120.00",date: "29 May 2026", status: "Processing" },
  { id: "#ORD-007", customer: "Ravi Kumar",    product: "Cargo Pants",     amount: "$44.00", date: "28 May 2026", status: "Delivered"  },
];

const statusClass = {
  Delivered:  "badge-success",
  Processing: "badge-info",
  Pending:    "badge-warning",
  Cancelled:  "badge-danger",
};

function Orders() {
  const [filter, setFilter] = useState("All");
  const filters = ["All", "Delivered", "Processing", "Pending", "Cancelled"];

  const filtered = filter === "All"
    ? ordersData
    : ordersData.filter((o) => o.status === filter);

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
              {f === "All" ? ordersData.length : ordersData.filter(o => o.status === f).length}
            </span>
          </button>
        ))}
      </div>

      <div className="table-container">
        <div className="table-header">
          <h2>Orders ({filtered.length})</h2>
        </div>
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
                <td style={{ fontWeight: 700 }}>{o.amount}</td>
                <td style={{ color: "var(--text-muted)", fontSize: "0.82rem" }}>{o.date}</td>
                <td><span className={`badge ${statusClass[o.status]}`}>{o.status}</span></td>
                <td>
                  <button className="btn btn-ghost btn-sm">👁️ View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Orders;
