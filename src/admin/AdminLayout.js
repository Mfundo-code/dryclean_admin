import React from 'react';
import { Link, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { clearToken, getUsername } from './api';

const NAV = [
  { to: '/admin', label: '📊 Dashboard' },
  { to: '/admin/orders', label: '📦 Orders' },
  { to: '/admin/services', label: '🧺 Services' },
  { to: '/admin/customers', label: '👥 Customers' },
  { to: '/admin/payments', label: '💰 Payments' },
  { to: '/admin/invoices', label: '🧾 Invoices' },
  { to: '/admin/documents', label: '📄 Documents' },
  { to: '/admin/messages', label: '✉️ Messages' },
  { to: '/admin/audit-logs', label: '📜 Audit Logs' },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const username = getUsername();

  const handleLogout = () => {
    clearToken();
    navigate('/admin/login', { replace: true });
  };

  return (
    <div style={styles.shell}>
      <aside style={styles.sidebar}>
        <div style={styles.sidebarTop}>
          <h2 style={styles.brand}>Dry Cleaners Admin</h2>
          <p style={styles.user}>👤 {username}</p>
          <nav style={styles.nav}>
            {NAV.map(({ to, label }) => {
              const active = location.pathname === to || (to !== '/admin' && location.pathname.startsWith(to));
              return (
                <Link
                  key={to}
                  to={to}
                  style={{ ...styles.link, ...(active ? styles.activeLink : {}) }}
                >
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>
        <button onClick={handleLogout} style={styles.logoutBtn}>🚪 Logout</button>
      </aside>
      <main style={styles.main}>
        <Outlet />
      </main>
    </div>
  );
}

const SIDEBAR_W = 230;

const styles = {
  shell: {
    display: 'flex',
    minHeight: '100vh',
  },
  sidebar: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: SIDEBAR_W,
    height: '100vh',
    background: '#1E3A8A',
    color: '#FFFFFF',
    padding: '24px 16px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    boxSizing: 'border-box',
    zIndex: 100,
    overflowY: 'auto',
  },
  sidebarTop: {
    display: 'flex',
    flexDirection: 'column',
  },
  brand: {
    color: '#FFFFFF',
    marginBottom: '4px',
    fontSize: '1.2rem',
  },
  user: {
    color: '#E0E7FF',
    fontSize: '0.8rem',
    marginBottom: '28px',
  },
  nav: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  link: {
    color: '#FFFFFF',
    textDecoration: 'none',
    padding: '9px 12px',
    borderRadius: '6px',
    fontSize: '0.95rem',
    display: 'block',
  },
  activeLink: {
    background: 'rgba(59,130,246,0.2)',
    fontWeight: 600,
  },
  logoutBtn: {
    background: 'transparent',
    border: '1.5px solid #FFFFFF',
    color: '#FFFFFF',
    padding: '9px 12px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.9rem',
    width: '100%',
    textAlign: 'left',
  },
  main: {
    marginLeft: SIDEBAR_W,
    flex: 1,
    background: '#F3F4F6',
    padding: '32px',
    minHeight: '100vh',
    boxSizing: 'border-box',
    overflowY: 'auto',
  },
};