import { useState } from "react";

function Analytics() {
  const [timeRange, setTimeRange] = useState("7 Days");
  const [activeCard, setActiveCard] = useState("profit");

  const monthlySales = [
    { month: "Jan", sales: 85, orders: 420 },
    { month: "Feb", sales: 70, orders: 380 },
    { month: "Mar", sales: 95, orders: 510 },
    { month: "Apr", sales: 110, orders: 600 },
    { month: "May", sales: 130, orders: 720 },
    { month: "Jun", sales: 155, orders: 840 },
  ];

  const topProducts = [
    { name: "Black Hoodie", sales: 420, revenue: "$20,995", stock: 5 },
    { name: "Running Shoes", sales: 310, revenue: "$27,590", stock: 12 },
    { name: "Slim Fit Jeans", sales: 250, revenue: "$9,997", stock: 0 },
    { name: "Floral Dress", sales: 195, revenue: "$10,725", stock: 42 },
  ];

  const formatStock = (stock) => {
    return `${String(stock).padStart(2, "0")} remaining`;
  };

  const getCardStyle = (cardName) => {
    const isActive = activeCard === cardName;
    return {
      border: isActive ? "2px solid #8b5cf6" : "1px solid var(--border)",
      boxShadow: isActive ? "0 10px 20px rgba(139, 92, 246, 0.12)" : "var(--shadow-sm)",
      transform: isActive ? "translateY(-2px)" : "none",
      cursor: "pointer",
      transition: "all 0.25s ease",
    };
  };

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
        <div
          className="stat-card"
          style={getCardStyle("profit")}
          onClick={() => setActiveCard("profit")}
        >
          <div className="stat-icon purple">📈</div>
          <div className="stat-info">
            <h3>$12,482</h3>
            <p>Net Profit</p>
            <span className="stat-badge up">+14.2%</span>
          </div>
        </div>
        <div
          className="stat-card"
          style={getCardStyle("conversion")}
          onClick={() => setActiveCard("conversion")}
        >
          <div className="stat-icon green">🎯</div>
          <div className="stat-info">
            <h3>64.3%</h3>
            <p>Conversion Rate</p>
            <span className="stat-badge up">+2.1%</span>
          </div>
        </div>
        <div
          className="stat-card"
          style={getCardStyle("views")}
          onClick={() => setActiveCard("views")}
        >
          <div className="stat-icon blue">🖱️</div>
          <div className="stat-info">
            <h3>45,182</h3>
            <p>Page Views</p>
            <span className="stat-badge up">+18.5%</span>
          </div>
        </div>
        <div
          className="stat-card"
          style={getCardStyle("value")}
          onClick={() => setActiveCard("value")}
        >
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

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", height: "260px", marginTop: "24px", paddingBottom: "12px", borderBottom: "1px solid var(--border)" }}>
            {monthlySales.map((data) => (
              <div key={data.month} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
                <div style={{ position: "relative", width: "100%", display: "flex", justifyContent: "center", height: "200px", alignItems: "flex-end" }}>
                  {/* Tooltip on hover */}
                  <span style={{
                    position: "absolute",
                    bottom: `${data.sales + 10}px`,
                    background: "#818cf8",
                    color: "white",
                    fontSize: "0.7rem",
                    fontWeight: 600,
                    padding: "4px 8px",
                    borderRadius: "4px",
                    whiteSpace: "nowrap"
                  }}>
                    ${data.sales}k
                  </span>

                  {/* Bar */}
                  <div style={{
                    width: "16px",
                    height: `${data.sales}px`,
                    background: "#8b5cf6",
                    borderRadius: "4px 4px 0 0",
                    transition: "height 0.5s ease"
                  }} />
                </div>
                <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "12px" }}>{data.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Orders Trend Section */}
        <div className="card">
          <h2 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: "8px" }}>Order Volume Trend</h2>
          <p style={{ fontSize: "0.82rem", color: "var(--text-secondary)" }}>Total processed orders per month</p>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", height: "260px", marginTop: "24px", paddingBottom: "12px", borderBottom: "1px solid var(--border)" }}>
            {monthlySales.map((data) => {
              const barHeight = data.orders / 5;
              return (
                <div key={data.month} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
                  <div style={{ position: "relative", width: "100%", display: "flex", justifyContent: "center", height: "200px", alignItems: "flex-end" }}>
                    <span style={{
                      position: "absolute",
                      bottom: `${barHeight + 10}px`,
                      background: "#10b981",
                      color: "white",
                      fontSize: "0.7rem",
                      fontWeight: 600,
                      padding: "4px 8px",
                      borderRadius: "4px",
                      whiteSpace: "nowrap"
                    }}>
                      {data.orders}
                    </span>

                    {/* Bar */}
                    <div style={{
                      width: "16px",
                      height: `${barHeight}px`,
                      background: "#10b981",
                      borderRadius: "4px 4px 0 0",
                      transition: "height 0.5s ease"
                    }} />
                  </div>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "12px" }}>{data.month}</span>
                </div>
              );
            })}
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
                  <div style={{ width: "100px", height: "6px", background: "#f1f5f9", borderRadius: "3px", overflow: "hidden", marginBottom: "4px" }}>
                    <div style={{ width: `${Math.min((p.stock / 100) * 100, 100)}%`, height: "100%", background: "#10b981" }} />
                  </div>
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "4px", display: "inline-block" }}>
                    {formatStock(p.stock)}
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
