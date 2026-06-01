import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const navItems = [
  { to: "/",            icon: "⊞",  label: "Dashboard"   },
  { to: "/products",    icon: "📦", label: "Products"     },
  { to: "/add-product", icon: "➕", label: "Add Product"  },
  { to: "/orders",      icon: "🛒", label: "Orders"       },
  { to: "/users",       icon: "👥", label: "Users"        },
  { to: "/analytics",   icon: "📊", label: "Analytics"    },
  { to: "/reviews",     icon: "⭐", label: "Reviews"      },
  { to: "/settings",    icon: "⚙️", label: "Settings"     },
];

function Sidebar() {
  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon">A</div>
        <div className="logo-text">
          <span className="logo-title">AdminHub</span>
          <span className="logo-sub">E-Commerce</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="sidebar-nav">
        <p className="nav-section-label">Main Menu</p>
        {navItems.slice(0, 5).map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </NavLink>
        ))}

        <p className="nav-section-label" style={{ marginTop: "20px" }}>Reports</p>
        {navItems.slice(5, 7).map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </NavLink>
        ))}

        <p className="nav-section-label" style={{ marginTop: "20px" }}>System</p>
        {navItems.slice(7).map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""}`
            }
          >
            <span className="nav-icon">{item.icon}</span>
            <span className="nav-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="admin-profile">
          <div className="avatar">AD</div>
          <div className="admin-info">
            <p className="admin-name">Admin User</p>
            <p className="admin-role">Super Admin</p>
          </div>
          <span className="online-dot" title="Online" />
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
