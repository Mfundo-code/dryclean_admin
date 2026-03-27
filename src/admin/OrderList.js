import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getOrders, deleteOrder } from './api';

const statusColor = (status) => {
  const map = {
    received: '#3B82F6',
    inspecting: '#F59E0B',
    cleaning: '#8B5CF6',
    ready: '#10B981',
    collected: '#6B7280',
    delivered: '#1E3A8A',
  };
  return map[status] || '#95a5a6';
};

export default function OrderList() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  const load = (status = '') => {
    setLoading(true);
    const params = {};
    if (status) params.status = status;
    getOrders(params)
      .then((res) => setOrders(res.data.results ?? res.data))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this order?')) return;
    await deleteOrder(id);
    load(statusFilter);
  };

  const handleStatusFilter = (e) => {
    const val = e.target.value;
    setStatusFilter(val);
    load(val);
  };

  if (loading) return <p>Loading…</p>;

  return (
    <div>
      <div style={styles.header}>
        <h1 style={{ color: '#1E3A8A', margin: 0 }}>Orders</h1>
        <Link to="/admin/orders/new" style={styles.newBtn}>+ New Order</Link>
      </div>

      <div style={{ marginBottom: 20 }}>
        <select value={statusFilter} onChange={handleStatusFilter} style={styles.select}>
          <option value="">All statuses</option>
          <option value="received">Received</option>
          <option value="inspecting">Inspecting</option>
          <option value="cleaning">Cleaning</option>
          <option value="ready">Ready</option>
          <option value="collected">Collected</option>
          <option value="delivered">Delivered</option>
        </select>
      </div>

      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.thead}>
              <th style={styles.th}>Order #</th>
              <th style={styles.th}>Customer</th>
              <th style={styles.th}>Status</th>
              <th style={styles.th}>Total</th>
              <th style={styles.th}>Payment</th>
              <th style={styles.th}>Created</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 && (
              <tr><td colSpan={7} style={{ padding: '20px', textAlign: 'center', color: '#6B7280' }}>No orders found.</td></tr>
            )}
            {orders.map((order) => (
              <tr key={order.id} style={styles.row}>
                <td style={styles.td}>{order.order_number}</td>
                <td style={styles.td}>{order.customer.name}</td>
                <td style={styles.td}>
                  <span style={{ ...styles.badge, background: statusColor(order.status) }}>
                    {order.status_display}
                  </span>
                </td>
                <td style={styles.td}>R {order.total_amount}</td>
                <td style={styles.td}>{order.payment_status_display}</td>
                <td style={styles.td}>{new Date(order.created_at).toLocaleDateString()}</td>
                <td style={styles.td}>
                  <Link to={`/admin/orders/${order.id}`} style={styles.actionLink}>View</Link>
                  <Link to={`/admin/orders/${order.id}/edit`} style={styles.actionLink}>Edit</Link>
                  <button onClick={() => handleDelete(order.id)} style={styles.deleteBtn}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' },
  newBtn: { background: '#1E3A8A', color: '#fff', padding: '10px 20px', borderRadius: '6px', textDecoration: 'none', fontSize: '0.95rem' },
  select: { padding: '9px 12px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '0.9rem' },
  tableWrap: { background: '#fff', borderRadius: '10px', boxShadow: '0 4px 14px rgba(0,0,0,.08)', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { background: '#1E3A8A' },
  th: { color: '#fff', padding: '12px 14px', textAlign: 'left', fontWeight: 600, fontSize: '0.85rem' },
  row: { borderBottom: '1px solid #f0f0f0' },
  td: { padding: '12px 14px', fontSize: '0.9rem', color: '#1F2937' },
  badge: { color: '#fff', padding: '3px 10px', borderRadius: '12px', fontSize: '0.78rem', fontWeight: 600, display: 'inline-block' },
  actionLink: { marginRight: '10px', color: '#1E3A8A', textDecoration: 'none', fontWeight: 500 },
  deleteBtn: { background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.9rem' },
};