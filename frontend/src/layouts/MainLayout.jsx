import { Outlet, NavLink } from "react-router-dom";
// no separate CSS import needed — it's in main.jsx

export default function MainLayout() {
  return (
    <div className="app-shell">
      <aside className="app-sidebar">
        <div className="sidebar-logo">
          <div className="sidebar-logo-text">RAAS<br/>DOS V1</div>
        </div>
        <nav className="sidebar-nav">
          {navItems.map(({ to, icon, label }) => (
            <NavLink key={to} to={to}
              className={({ isActive }) => "sidebar-nav-item" + (isActive ? " active" : "")}>
              {icon}<span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </aside>

      <div className="app-main">
        <div className="app-topnav">
          <span>Notifications</span>
          <span>Admin</span>
        </div>
        <div className="app-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
