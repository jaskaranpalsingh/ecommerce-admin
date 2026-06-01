import { useState } from "react";

function Settings() {
  const [storeName, setStoreName] = useState("My Premium Store");
  const [email, setEmail] = useState("support@premiumstore.com");
  const [currency, setCurrency] = useState("USD");
  const [maintenance, setMaintenance] = useState(false);
  const [alert, setAlert] = useState("");

  const handleSave = (e) => {
    e.preventDefault();
    setAlert("Settings saved successfully!");
    setTimeout(() => setAlert(""), 3000);
  };

  return (
    <>
      <div className="page-header">
        <h1>Settings</h1>
        <p>Configure store details, preferences, and payment details.</p>
      </div>

      <div style={{ maxWidth: "720px" }}>
        {alert && (
          <div style={{
            background: "rgba(34,197,94,0.1)", border: "1px solid rgba(34,197,94,0.3)",
            borderRadius: "var(--radius-sm)", padding: "14px 18px", marginBottom: "24px",
            color: "var(--success)", fontSize: "0.875rem"
          }}>
            ✅ {alert}
          </div>
        )}

        <form onSubmit={handleSave} className="form-card" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          <div>
            <h2 style={{ fontSize: "1.05rem", fontWeight: 600, marginBottom: "16px", paddingBottom: "8px", borderBottom: "1px solid var(--border)" }}>
              General Settings
            </h2>
            <div className="form-row">
              <div className="form-group">
                <label>Store Name</label>
                <input
                  type="text"
                  value={storeName}
                  onChange={(e) => setStoreName(e.target.value)}
                  required
                />
              </div>
              <div className="form-group">
                <label>Contact Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Currency</label>
                <select value={currency} onChange={(e) => setCurrency(e.target.value)}>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="INR">INR (₹)</option>
                </select>
              </div>
              <div className="form-group" style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <label style={{ marginBottom: "12px" }}>Maintenance Mode</label>
                <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", fontSize: "0.875rem", color: "var(--text-secondary)" }}>
                  <input
                    type="checkbox"
                    checked={maintenance}
                    onChange={(e) => setMaintenance(e.target.checked)}
                    style={{ width: "auto", cursor: "pointer" }}
                  />
                  Disable public access to store
                </label>
              </div>
            </div>
          </div>

          <div>
            <h2 style={{ fontSize: "1.05rem", fontWeight: 600, marginBottom: "16px", paddingBottom: "8px", borderBottom: "1px solid var(--border)" }}>
              Payment Configuration
            </h2>
            <div className="form-row">
              <div className="form-group">
                <label>Stripe Public Key</label>
                <input
                  type="text"
                  placeholder="pk_test_..."
                  disabled
                  value="pk_test_51Nx...8z9x"
                  style={{ color: "var(--text-muted)", cursor: "not-allowed" }}
                />
              </div>
              <div className="form-group">
                <label>Stripe Secret Key</label>
                <input
                  type="password"
                  placeholder="sk_test_..."
                  disabled
                  value="••••••••••••••••••••••••"
                  style={{ color: "var(--text-muted)", cursor: "not-allowed" }}
                />
              </div>
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
            <button type="submit" className="btn btn-primary">
              💾 Save Settings
            </button>
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => {
                setStoreName("My Premium Store");
                setEmail("support@premiumstore.com");
                setCurrency("USD");
                setMaintenance(false);
              }}
            >
              🔄 Revert
            </button>
          </div>

        </form>
      </div>
    </>
  );
}

export default Settings;
