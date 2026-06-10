import { useEffect, useState } from "react";
import API from "../Services/api";

const statusClass = {
  Delivered:  "badge-success",
  Processing: "badge-info",
  Pending:    "badge-warning",
  Cancelled:  "badge-danger",
  Shipped:    "badge-purple", // Shipped is colored purple
};

const loadHtml2Pdf = () => {
  return new Promise((resolve, reject) => {
    if (window.html2pdf) {
      resolve(window.html2pdf);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js";
    script.onload = () => resolve(window.html2pdf);
    script.onerror = reject;
    document.body.appendChild(script);
  });
};

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("All");
  const [downloadingId, setDownloadingId] = useState(null);

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

  const handleDownloadInvoice = async (orderId, orderIdString) => {
    try {
      setDownloadingId(orderId);

      // 1. Fetch full order details with auth headers
      const userInfo = localStorage.getItem("userInfo")
        ? JSON.parse(localStorage.getItem("userInfo"))
        : null;
      const token = userInfo?.token;

      const res = await API.get(`/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const order = res.data;

      // 2. Load html2pdf library
      const html2pdf = await loadHtml2Pdf();

      // 3. Create invoice printable element
      const element = document.createElement("div");
      element.style.padding = "40px";
      element.style.fontFamily = "'Inter', Arial, sans-serif";
      element.style.color = "#1e293b";
      element.style.background = "#ffffff";
      
      const invoiceDate = order.createdAt ? new Date(order.createdAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric"
      }) : "N/A";

      const itemsHtml = order.orderItems.map(item => `
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 12px 0; font-size: 14px;">
            <div style="font-weight: 600; color: #0f172a;">${item.title}</div>
          </td>
          <td style="padding: 12px 0; text-align: right; font-size: 14px; color: #475569;">$${item.price.toFixed(2)}</td>
          <td style="padding: 12px 0; text-align: center; font-size: 14px; color: #475569;">${item.qty}</td>
          <td style="padding: 12px 0; text-align: right; font-size: 14px; font-weight: 600; color: #0f172a;">$${(item.price * item.qty).toFixed(2)}</td>
        </tr>
      `).join("");

      element.innerHTML = `
        <div style="max-width: 800px; margin: 0 auto;">
          <!-- Header -->
          <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #f1f5f9; padding-bottom: 24px; margin-bottom: 30px;">
            <div>
              <h1 style="font-size: 28px; font-weight: 800; letter-spacing: 4px; color: #0f172a; margin: 0 0 4px 0;">NURFIA</h1>
              <p style="font-size: 12px; color: #64748b; margin: 0;">Premium Fashion & Apparel Store</p>
            </div>
            <div style="text-align: right;">
              <h2 style="font-size: 20px; font-weight: 700; color: #0f172a; margin: 0 0 6px 0;">INVOICE</h2>
              <p style="font-size: 12px; color: #64748b; margin: 0 0 4px 0;"><strong>Invoice No:</strong> ${orderIdString}</p>
              <p style="font-size: 12px; color: #64748b; margin: 0;"><strong>Date:</strong> ${invoiceDate}</p>
            </div>
          </div>

          <!-- Addresses -->
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px;">
            <div>
              <h3 style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #64748b; margin: 0 0 8px 0; letter-spacing: 1px;">Supplier</h3>
              <p style="font-size: 14px; font-weight: 600; color: #0f172a; margin: 0 0 4px 0;">NURFIA Headquarters</p>
              <p style="font-size: 13px; color: #475569; margin: 0 0 4px 0; line-height: 1.5;">12 Fashion Boulevard<br>New Delhi, 110001<br>India</p>
              <p style="font-size: 13px; color: #475569; margin: 0;">support@nurfia.com</p>
            </div>
            <div>
              <h3 style="font-size: 11px; font-weight: 700; text-transform: uppercase; color: #64748b; margin: 0 0 8px 0; letter-spacing: 1px;">Ship To</h3>
              <p style="font-size: 14px; font-weight: 600; color: #0f172a; margin: 0 0 4px 0;">${order.shippingAddress?.fullName || "Customer"}</p>
              <p style="font-size: 13px; color: #475569; margin: 0 0 4px 0; line-height: 1.5;">
                ${order.shippingAddress?.address || ""}<br>
                ${order.shippingAddress?.city || ""}, ${order.shippingAddress?.postalCode || ""}<br>
                ${order.shippingAddress?.country || ""}
              </p>
            </div>
          </div>

          <!-- Items Table -->
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
            <thead>
              <tr style="border-bottom: 2px solid #e2e8f0; text-align: left; font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 0.5px;">
                <th style="padding: 10px 0;">Item Description</th>
                <th style="padding: 10px 0; text-align: right; width: 100px;">Price</th>
                <th style="padding: 10px 0; text-align: center; width: 60px;">Qty</th>
                <th style="padding: 10px 0; text-align: right; width: 100px;">Total</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <!-- Totals & Payment -->
          <div style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div>
              <h4 style="font-size: 12px; font-weight: 700; color: #0f172a; margin: 0 0 6px 0;">Payment Method</h4>
              <p style="font-size: 13px; color: #475569; margin: 0 0 4px 0;">Credit Card / Stripe</p>
              <p style="font-size: 13px; color: #475569; margin: 0;"><strong>Status:</strong> ${order.status === "Delivered" ? "Paid" : "Processing"}</p>
            </div>
            <div style="width: 250px;">
              <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <tr>
                  <td style="padding: 6px 0; color: #64748b;">Subtotal</td>
                  <td style="padding: 6px 0; text-align: right; font-weight: 600; color: #0f172a;">$${order.subtotal?.toFixed(2) || (order.totalPrice - (order.shippingPrice || 0)).toFixed(2)}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #64748b;">Shipping</td>
                  <td style="padding: 6px 0; text-align: right; font-weight: 600; color: #0f172a;">$${order.shippingPrice?.toFixed(2) || "0.00"}</td>
                </tr>
                <tr style="border-top: 1px solid #e2e8f0;">
                  <td style="padding: 12px 0 0 0; font-size: 16px; font-weight: 700; color: #0f172a;">Grand Total</td>
                  <td style="padding: 12px 0 0 0; font-size: 16px; font-weight: 700; text-align: right; color: #0f172a;">$${order.totalPrice.toFixed(2)}</td>
                </tr>
              </table>
            </div>
          </div>

          <!-- Footer Note -->
          <div style="margin-top: 60px; padding-top: 20px; border-top: 1px solid #f1f5f9; text-align: center;">
            <p style="font-size: 12px; color: #94a3b8; margin: 0 0 6px 0;">Thank you for shopping with NURFIA! 🎉</p>
            <p style="font-size: 11px; color: #cbd5e1; margin: 0;">If you have any questions about this invoice, contact support@nurfia.com</p>
          </div>
        </div>
      `;

      // 4. Run html2pdf
      const opt = {
        margin:       10,
        filename:     `invoice_${orderIdString.replace("#", "")}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { scale: 2, useCORS: true },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      await html2pdf().from(element).set(opt).save();

    } catch (err) {
      console.error("Failed to download invoice:", err);
      alert("Error generating invoice PDF. Please try again.");
    } finally {
      setDownloadingId(null);
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
                      <button
                        className="btn btn-ghost btn-sm"
                        title="Download Invoice PDF"
                        disabled={downloadingId === o.id}
                        onClick={() => handleDownloadInvoice(o.id, o.orderIdString)}
                        style={{
                          padding: "5px 10px",
                          fontSize: "0.75rem",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          border: "1px solid var(--border)",
                          borderRadius: "var(--radius-sm)"
                        }}
                      >
                        {downloadingId === o.id ? "⏳" : "📥 Invoice"}
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

export default Orders;
