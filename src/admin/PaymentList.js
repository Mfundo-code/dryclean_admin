import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getPayments, deletePayment } from './api';

export default function PaymentList() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    getPayments()
      .then((res) => setPayments(res.data.results ?? res.data))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this payment?')) return;
    await deletePayment(id);
    load();
  };

  if (loading) return <p>Loading…</p>;

  return (
    <div>
      <div style={styles.header}>
        <h1 style={{ color: '#1E3A8A', margin: 0 }}>Payments</h1>
        <Link to="/admin/payments/new" style={styles.newBtn}>+ New Payment</Link>
      </div>

      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.thead}>
              <th style={styles.th}>Order #</th>
              <th style={styles.th}>Amount</th>
              <th style={styles.th}>Method</th>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Reference</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.length === 0 && (
              <tr><td colSpan={6} style={{ padding: '20px', textAlign: 'center', color: '#6B7280' }}>No payments found.</td></tr>
            )}
            {payments.map((p) => (
              <tr key={p.id} style={styles.row}>
                <td style={styles.td}>
                  <Link to={`/admin/orders/${p.order}`} style={styles.link}>Order #{p.order}</Link>
                </td>
                <td style={styles.td}>R {p.amount}</td>
                <td style={styles.td}>{p.method}</td>
                <td style={styles.td}>{new Date(p.date).toLocaleString()}</td>
                <td style={styles.td}>{p.reference || '—'}</td>
                <td style={styles.td}>
                  <Link to={`/admin/payments/${p.id}/edit`} style={styles.actionLink}>Edit</Link>
                  <button onClick={() => handleDelete(p.id)} style={styles.deleteBtn}>Delete</button>
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
  tableWrap: { background: '#fff', borderRadius: '10px', boxShadow: '0 4px 14px rgba(0,0,0,.08)', overflow: 'hidden' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { background: '#1E3A8A' },
  th: { color: '#fff', padding: '12px 14px', textAlign: 'left', fontWeight: 600, fontSize: '0.85rem' },
  row: { borderBottom: '1px solid #f0f0f0' },
  td: { padding: '12px 14px', fontSize: '0.9rem', color: '#1F2937' },
  link: { color: '#1E3A8A', textDecoration: 'none' },
  actionLink: { marginRight: '10px', color: '#1E3A8A', textDecoration: 'none', fontWeight: 500 },
  deleteBtn: { background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.9rem' },
};