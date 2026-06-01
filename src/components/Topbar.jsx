import { useLocation } from "react-router-dom";
import "./Topbar.css";

const pageTitles = {
  "/":            { title: "Dashboard",   sub: "Welcome back, Admin 👋" },
  "/products":    { title: "Products",    sub: "Manage your product catalog" },
  "/add-product": { title: "Add Product", sub: "Create a new product listing" },
  "/orders":      { title: "Orders",      sub: "Track and manage all orders" },
  "/users":       { title: "Users",       sub: "Manage your customers" },
  "/analytics":   { title: "Analytics",   sub: "Business insights & reports" },
  "/reviews":     { title: "Reviews",     sub: "Customer feedback & ratings" },
  "/settings":    { title: "Settings",    sub: "Configure your admin panel" },
};

function Topbar() {
  const { pathname } = useLocation();
  const page = pageTitles[pathname] || { title: "Admin", sub: "" };

  return (
    <header className="topbar">
      <div className="topbar-left">
        <h2 className="topbar-title">{page.title}</h2>
        <p className="topbar-sub">{page.sub}</p>
      </div>

      <div className="topbar-right">
        {/* Search */}
        <div className="topbar-search">
          <span className="topbar-search-icon">🔍</span>
          <input type="text" placeholder="Search anything..." />
        </div>

        {/* Notification bell */}
        <button className="icon-btn" title="Notifications">
          🔔
          <span className="notif-badge">3</span>
        </button>

        {/* Avatar */}
        <div className="topbar-avatar" title="Admin Profile">
          AD
        </div>
      </div>
    </header>
  );
}

export default Topbar;
