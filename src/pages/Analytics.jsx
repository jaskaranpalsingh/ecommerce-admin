import { useState } from "react";

function Analytics() {
  const [timeRange, setTimeRange] = useState("7 Days");

  const monthlySales = [
    { month: "Jan", sales: 85, orders: 420 },
    { month: "Feb", sales: 70, orders: 380 },
    { month: "Mar", sales: 95, orders: 510 },
    { month: "Apr", sales: 110, orders: 600 },
    { month: "May", sales: 130, orders: 720 },
    { month: "Jun", sales: 155, orders: 840 },
  ];

  const topProducts = [
    { name: "Black Hoodie", sales: 420, revenue: "$20,995", stock: 85 },
    { name: "Running Shoes", sales: 310, revenue: "$27,590", stock: 120 },
    { name: "Slim Fit Jeans", sales: 250, revenue: "$9,997", stock: 64 },
    { name: "Floral Dress", sales: 195, revenue: "$10,725", stock: 42 },
  ];

  return (
    <>
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <h1>Analytics</h1>
          <p>Detailed overview of your sales, traffic, and store performance.</p>
        </div>
        <div>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            style={{
              padding: "10px 16px",
              background: "var(--bg-secondary)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-sm)",
              color: "var(--text-primary)",
              outline: "none",
              cursor: "pointer",
            }}
          >
            <option>Today</option>
            <option>7 Days</option>
            <option>30 Days</option>
            <option>12 Months</option>
          </select>
        </div>
      </div>

      {/* Grid of details */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon purple">📈</div>
          <div className="stat-info">
            <h3>$12,482</h3>
            <p>Net Profit</p>
            <span className="stat-badge up">+14.2%</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon green">🎯</div>
          <div className="stat-info">
            <h3>64.3%</h3>
            <p>Conversion Rate</p>
            <span className="stat-badge up">+2.1%</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon blue">🖱️</div>
          <div className="stat-info">
            <h3>45,182</h3>
            <p>Page Views</p>
            <span className="stat-badge up">+18.5%</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon amber">🛍️</div>
          <div className="stat-info">
            <h3>$38.50</h3>
            <p>Avg Order Value</p>
            <span className="stat-badge down">-1.4%</span>
          </div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px", marginBottom: "28px" }}>
        {/* Sales Chart Section */}
        <div className="card">
          <h2 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "8px" }}>Sales Revenue Trend</h2>
          <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>Monthly growth comparison in USD</p>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", height: "240px", marginTop: "24px", paddingBottom: "12px", borderBottom: "1px solid var(--border)" }}>
            {monthlySales.map((data) => (
              <div key={data.month} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
                <div style={{ position: "relative", width: "32px", display: "flex", justifyContent: "center" }}>
                  {/* Tooltip on hover */}
                  <span style={{
                    position: "absolute",
                    top: "-28px",
                    background: "var(--accent)",
                    color: "white",
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    padding: "2px 6px",
                    borderRadius: "4px",
                    opacity: 0.9
                  }}>
                    ${data.sales}k
                  </span>
                  
                  {/* Bar */}
                  <div style={{
                    width: "16px",
                    height: `${data.sales}px`,
                    background: "var(--accent-gradient)",
                    borderRadius: "4px 4px 0 0",
                    transition: "height 0.5s ease"
                  }} />
                </div>
                <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "8px" }}>{data.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Orders Trend Section */}
        <div className="card">
          <h2 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "8px" }}>Order Volume Trend</h2>
          <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>Total processed orders per month</p>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", height: "240px", marginTop: "24px", paddingBottom: "12px", borderBottom: "1px solid var(--border)" }}>
            {monthlySales.map((data) => (
              <div key={data.month} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
                <div style={{ position: "relative", width: "32px", display: "flex", justifyContent: "center" }}>
                  <span style={{
                    position: "absolute",
                    top: "-28px",
                    background: "#22c55e",
                    color: "white",
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    padding: "2px 6px",
                    borderRadius: "4px",
                    opacity: 0.9
                  }}>
                    {data.orders}
                  </span>
                  
                  {/* Bar */}
                  <div style={{
                    width: "16px",
                    height: `${data.orders / 5}px`, // scaled for display
                    background: "linear-gradient(135deg, #22c55e, #10b981)",
                    borderRadius: "4px 4px 0 0",
                    transition: "height 0.5s ease"
                  }} />
                </div>
                <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "8px" }}>{data.month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Products Table */}
      <div className="table-container">
        <div className="table-header">
          <h2>Top Selling Products</h2>
        </div>
        <table>
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Items Sold</th>
              <th>Total Revenue</th>
              <th>Stock Status</th>
            </tr>
          </thead>
          <tbody>
            {topProducts.map((p, index) => (
              <tr key={index}>
                <td style={{ fontWeight: 600 }}>{p.name}</td>
                <td>{p.sales} units</td>
                <td style={{ color: "var(--accent-light)", fontWeight: 700 }}>{p.revenue}</td>
                <td>
                  <div style={{ width: "100px", height: "6px", background: "var(--bg-primary)", borderRadius: "3px", overflow: "hidden" }}>
                    <div style={{ width: `${Math.min(p.stock, 100)}%`, height: "100%", background: "var(--success)" }} />
                  </div>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px", display: "inline-block" }}>
                    {p.stock} remaining
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Analytics;
