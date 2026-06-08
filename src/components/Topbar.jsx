import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import API from "../Services/api";
import "./Topbar.css";

const pageTitles = {
  "/": { title: "Dashboard", sub: "Welcome back, Admin 👋" },
  "/products": { title: "Products", sub: "Manage your product catalog" },
  "/add-product": { title: "Add Product", sub: "Create a new product listing" },
  "/orders": { title: "Orders", sub: "Track and manage all orders" },
  "/users": { title: "Users", sub: "Manage your customers" },
  "/analytics": { title: "Analytics", sub: "Business insights & reports" },
  "/reviews": { title: "Reviews", sub: "Customer feedback & ratings" },
  "/settings": { title: "Settings", sub: "Configure your admin panel" },
};

function Topbar({ onMenuClick }) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const page = pageTitles[pathname] || { title: "Admin", sub: "" };

  // Admin Info
  const userInfo = localStorage.getItem("userInfo")
    ? JSON.parse(localStorage.getItem("userInfo"))
    : null;
  const adminName = userInfo?.name || "Admin User";
  const initials = adminName.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2) || "AD";

  // Dropdown states
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState({ products: [], users: [], orders: [] });
  const [loadingSearch, setLoadingSearch] = useState(false);

  const [showNotif, setShowNotif] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const [showProfile, setShowProfile] = useState(false);

  // Refs for closing outside
  const searchRef = useRef(null);
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  // Fetch notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await API.get("/admin/notifications");
        setNotifications(res.data);
        setUnreadCount(res.data.length);
      } catch (err) {
        console.error("Error fetching notifications:", err);
      }
    };
    fetchNotifications();

    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  // Search API fetch with simple debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults({ products: [], users: [], orders: [] });
      return;
    }

    const delayDebounce = setTimeout(async () => {
      setLoadingSearch(true);
      try {
        const res = await API.get(`/admin/search?q=${searchQuery}`);
        setSearchResults(res.data);
      } catch (err) {
        console.error("Error searching:", err);
      } finally {
        setLoadingSearch(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  // Click outside listener
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearch(false);
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotif(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  // Keyboard shortcut Ctrl+K / Cmd+K
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        const searchInput = document.getElementById("global-search-input");
        if (searchInput) {
          searchInput.focus();
          setShowSearch(true);
        }
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("userInfo");
    window.location.href = "http://localhost:5174/login";
  };

  const handleNotifClick = (item) => {
    setShowNotif(false);
    navigate(item.link);
    setNotifications(prev => prev.filter(n => n.id !== item.id));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  const timeAgo = (dateStr) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    const seconds = Math.floor((new Date() - date) / 1000);
    if (isNaN(seconds)) return "";
    let interval = Math.floor(seconds / 31536000);
    if (interval >= 1) return `${interval}y ago`;
    interval = Math.floor(seconds / 2592000);
    if (interval >= 1) return `${interval}mo ago`;
    interval = Math.floor(seconds / 86400);
    if (interval >= 1) return `${interval}d ago`;
    interval = Math.floor(seconds / 3600);
    if (interval >= 1) return `${interval}h ago`;
    interval = Math.floor(seconds / 60);
    if (interval >= 1) return `${interval}m ago`;
    return "just now";
  };

  return (
    <header className="topbar">
      {/* Hamburger — only visible on mobile */}
      <button className="menu-btn" onClick={onMenuClick} aria-label="Toggle menu">
        <span />
        <span />
        <span />
      </button>

      <div className="topbar-left">
        <h2 className="topbar-title">{page.title}</h2>
        <p className="topbar-sub">{page.sub}</p>
      </div>

      <div className="topbar-right">
        {/* Search */}
        <div className="topbar-search" ref={searchRef}>
          <span className="topbar-search-icon">🔍</span>
          <input
            id="global-search-input"
            type="text"
            placeholder="Search anything... (Ctrl+K)"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSearch(true);
            }}
            onFocus={() => setShowSearch(true)}
          />

          {showSearch && searchQuery.trim() !== "" && (
            <div className="search-dropdown-menu">
              {loadingSearch ? (
                <div className="search-loading">
                  <div className="spinner-loader-small" />
                  <span>Searching...</span>
                </div>
              ) : (
                <>
                  {/* Products */}
                  {searchResults.products?.length > 0 && (
                    <div className="search-section">
                      <div className="search-section-header">Products</div>
                      {searchResults.products.map(p => (
                        <div
                          key={p._id}
                          className="search-result-item"
                          onClick={() => {
                            setShowSearch(false);
                            setSearchQuery("");
                            navigate("/products");
                          }}
                        >
                          <img src={p.image || "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=100"} alt="" className="search-item-thumb" />
                          <div className="search-item-details">
                            <span className="search-item-title">{p.title}</span>
                            <span className="search-item-meta">{p.category} • ${p.price}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Orders */}
                  {searchResults.orders?.length > 0 && (
                    <div className="search-section">
                      <div className="search-section-header">Orders</div>
                      {searchResults.orders.map(o => (
                        <div
                          key={o.id}
                          className="search-result-item"
                          onClick={() => {
                            setShowSearch(false);
                            setSearchQuery("");
                            navigate("/orders");
                          }}
                        >
                          <div className="search-item-icon order-icon">📦</div>
                          <div className="search-item-details">
                            <span className="search-item-title">{o.orderIdString}</span>
                            <span className="search-item-meta">{o.customer} • {o.amount}</span>
                          </div>
                          <span className={`search-badge status-${o.status?.toLowerCase()}`}>{o.status}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Users */}
                  {searchResults.users?.length > 0 && (
                    <div className="search-section">
                      <div className="search-section-header">Users</div>
                      {searchResults.users.map(u => (
                        <div
                          key={u._id}
                          className="search-result-item"
                          onClick={() => {
                            setShowSearch(false);
                            setSearchQuery("");
                            navigate("/users");
                          }}
                        >
                          <div className="search-item-icon user-icon">👤</div>
                          <div className="search-item-details">
                            <span className="search-item-title">{u.name}</span>
                            <span className="search-item-meta">{u.email}</span>
                          </div>
                          <span className="search-badge role-badge">{u.isAdmin ? "Admin" : "Customer"}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {searchResults.products?.length === 0 &&
                   searchResults.orders?.length === 0 &&
                   searchResults.users?.length === 0 && (
                    <div className="search-no-results">
                      No matches found for "{searchQuery}"
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </div>

        {/* Notification bell */}
        <div className="notif-wrapper" ref={notifRef}>
          <button
            className="icon-btn"
            title="Notifications"
            onClick={() => setShowNotif(!showNotif)}
          >
            🔔
            {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
          </button>

          {showNotif && (
            <div className="notif-dropdown">
              <div className="notif-header">
                <h3>Notifications</h3>
                {unreadCount > 0 && (
                  <button className="clear-all-btn" onClick={clearAllNotifications}>Clear all</button>
                )}
              </div>
              <div className="notif-list">
                {notifications.length === 0 ? (
                  <div className="notif-empty">
                    <span className="empty-bell">🔔</span>
                    <p>No new notifications</p>
                  </div>
                ) : (
                  notifications.map(item => (
                    <div
                      key={item.id}
                      className="notif-item"
                      onClick={() => handleNotifClick(item)}
                    >
                      <div className={`notif-icon-circle ${item.type}`}>
                        {item.type === "order" ? "🛍️" : "👤"}
                      </div>
                      <div className="notif-body">
                        <p className="notif-text">{item.text}</p>
                        <span className="notif-time">{timeAgo(item.time)}</span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Avatar */}
        <div className="avatar-wrapper" ref={profileRef}>
          <div
            className="topbar-avatar"
            title="Admin Profile"
            onClick={() => setShowProfile(!showProfile)}
          >
            {initials}
          </div>

          {showProfile && (
            <div className="profile-dropdown-menu">
              <div className="profile-dropdown-header">
                <p className="profile-admin-name">{adminName}</p>
                <p className="profile-admin-role">Administrator</p>
              </div>
              <div className="profile-dropdown-divider" />
              <Link to="/settings" className="profile-dropdown-item" onClick={() => setShowProfile(false)}>
                ⚙️ Settings
              </Link>
              <div className="profile-dropdown-divider" />
              <button className="profile-dropdown-item logout-item" onClick={handleLogout}>
                🚪 Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Topbar;