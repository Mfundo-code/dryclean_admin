import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getServices, deleteService } from './api';

export default function ServiceList() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    getServices()
      .then((res) => setServices(res.data.results ?? res.data))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this service?')) return;
    await deleteService(id);
    load();
  };

  if (loading) return <p>Loading…</p>;

  return (
    <div>
      <div style={styles.header}>
        <h1 style={{ color: '#1E3A8A', margin: 0 }}>Services</h1>
        <Link to="/admin/services/new" style={styles.newBtn}>+ New Service</Link>
      </div>

      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.thead}>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Description</th>
              <th style={styles.th}>Price</th>
              <th style={styles.th}>Active</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {services.length === 0 && (
              <tr><td colSpan={5} style={{ padding: '20px', textAlign: 'center', color: '#6B7280' }}>No services found.</td></tr>
            )}
            {services.map((s) => (
              <tr key={s.id} style={styles.row}>
                <td style={styles.td}>{s.name}</td>
                <td style={styles.td}>{s.description}</td>
                <td style={styles.td}>R {s.price}</td>
                <td style={styles.td}>{s.is_active ? '✅' : '❌'}</td>
                <td style={styles.td}>
                  <Link to={`/admin/services/${s.id}/edit`} style={styles.actionLink}>Edit</Link>
                  <button onClick={() => handleDelete(s.id)} style={styles.deleteBtn}>Delete</button>
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
  actionLink: { marginRight: '10px', color: '#1E3A8A', textDecoration: 'none', fontWeight: 500 },
  deleteBtn: { background: 'none', border: 'none', color: '#EF4444', cursor: 'pointer', textDecoration: 'underline', fontSize: '0.9rem' },
};