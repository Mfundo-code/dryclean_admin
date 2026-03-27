import React, { useEffect, useState } from 'react';
import { getStats } from './api';
import {
  ResponsiveContainer, LineChart, Line, BarChart, Bar,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';

const COLORS = {
  primary: '#1E3A8A',
  accent: '#3B82F6',
  light: '#F3F4F6',
  grey: '#6B7280',
  gold: '#F59E0B',
  green: '#10B981',
  red: '#EF4444',
  purple: '#8B5CF6',
};

const Card = ({ title, children, span = 1 }) => (
  <div style={{ ...styles.card, gridColumn: `span ${span}` }}>
    {title && <h3 style={styles.cardTitle}>{title}</h3>}
    {children}
  </div>
);

const StatPill = ({ label, value, color, icon }) => (
  <div style={{ ...styles.pill, borderTop: `4px solid ${color}` }}>
    <span style={styles.pillIcon}>{icon}</span>
    <p style={{ ...styles.pillValue, color }}>{value ?? '–'}</p>
    <p style={styles.pillLabel}>{label}</p>
  </div>
);

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getStats()
      .then((res) => setStats(res.data))
      .catch(() => setError('Failed to load stats.'));
  }, []);

  if (error) return <p style={{ color: COLORS.red }}>{error}</p>;
  if (!stats) return <p>Loading analytics…</p>;

  const dailySales = stats.daily_sales || [];
  const popularServices = stats.popular_services || [];
  const ordersByStatus = stats.orders_by_status || [];

  const statusColors = {
    received: '#3B82F6',
    inspecting: '#F59E0B',
    cleaning: '#8B5CF6',
    ready: '#10B981',
    collected: '#6B7280',
    delivered: '#1E3A8A',
  };

  return (
    <div>
      <div style={styles.pageHeader}>
        <div>
          <h1 style={styles.pageTitle}>Dashboard</h1>
          <p style={styles.pageSubtitle}>Live analytics & shop overview</p>
        </div>
        <div style={styles.refreshBtn} onClick={() => window.location.reload()} title="Refresh">
          ↻ Refresh
        </div>
      </div>

      <div style={styles.pillGrid}>
        <StatPill icon="📦" label="Total Orders" value={stats.total_orders} color={COLORS.primary} />
        <StatPill icon="💰" label="Total Revenue" value={`R ${stats.total_revenue?.toFixed(2)}`} color={COLORS.accent} />
        <StatPill icon="⏳" label="Unpaid Orders" value={stats.unpaid_orders} color={COLORS.red} />
        <StatPill icon="🔄" label="Repeat Customers" value={stats.repeat_customers} color={COLORS.gold} />
        <StatPill icon="🧺" label="Active Services" value={stats.active_services} color={COLORS.green} />
        <StatPill icon="✉️" label="Unread Messages" value={stats.unread_messages} color={COLORS.purple} />
      </div>

      <div style={styles.grid}>
        <Card title="📈 Daily Sales (Last 7 Days)" span={2}>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={dailySales} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Line type="monotone" dataKey="sales" name="Sales (R)" stroke={COLORS.accent} strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card title="🔥 Popular Services">
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={popularServices} layout="vertical" margin={{ top: 5, right: 30, left: 60, bottom: 5 }}>
              <XAxis type="number" />
              <YAxis dataKey="service__name" type="category" tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" fill={COLORS.accent} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card title="📊 Orders by Status">
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={ordersByStatus}
                dataKey="count"
                nameKey="status"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {ordersByStatus.map((entry, index) => (
                  <Cell key={index} fill={statusColors[entry.status] || COLORS.grey} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </div>
  );
}

const styles = {
  pageHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  pageTitle: {
    color: '#1E3A8A',
    margin: '0 0 4px',
    fontSize: '1.6rem',
    fontWeight: 700,
  },
  pageSubtitle: {
    color: '#6B7280',
    margin: 0,
    fontSize: '0.85rem',
  },
  refreshBtn: {
    background: '#1E3A8A',
    color: '#fff',
    padding: '8px 16px',
    borderRadius: 6,
    cursor: 'pointer',
    fontSize: '0.85rem',
    fontWeight: 600,
  },
  pillGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
    gap: 14,
    marginBottom: 24,
  },
  pill: {
    background: '#fff',
    borderRadius: 10,
    padding: '18px 14px',
    textAlign: 'center',
    boxShadow: '0 2px 10px rgba(0,0,0,.07)',
  },
  pillIcon: { fontSize: '1.4rem' },
  pillValue: { fontSize: '2rem', fontWeight: 800, margin: '6px 0 2px' },
  pillLabel: { color: '#6B7280', fontSize: '0.75rem', margin: 0, lineHeight: 1.3 },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 20,
  },
  card: {
    background: '#fff',
    borderRadius: 12,
    padding: '20px 22px',
    boxShadow: '0 2px 12px rgba(0,0,0,.08)',
  },
  cardTitle: {
    color: '#1E3A8A',
    margin: '0 0 16px',
    fontSize: '0.95rem',
    fontWeight: 700,
  },
};