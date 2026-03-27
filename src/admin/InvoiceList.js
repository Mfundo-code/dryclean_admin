import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getInvoices, deleteInvoice } from './api';

export default function InvoiceList() {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    getInvoices()
      .then((res) => setInvoices(res.data.results ?? res.data))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this invoice?')) return;
    await deleteInvoice(id);
    load();
  };

  if (loading) return <p>Loading…</p>;

  return (
    <div>
      <div style={styles.header}>
        <h1 style={{ color: '#1E3A8A', margin: 0 }}>Invoices</h1>
        <Link to="/admin/invoices/new" style={styles.newBtn}>+ New Invoice</Link>
      </div>

      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.thead}>
              <th style={styles.th}>Invoice #</th>
              <th style={styles.th}>Order</th>
              <th style={styles.th}>Issued Date</th>
              <th style={styles.th}>PDF</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.length === 0 && (
              <tr>
                <td colSpan={5} style={{ padding: '20px', textAlign: 'center', color: '#6B7280' }}>
                  No invoices found.
                </td>
              </tr>
            )}
            {invoices.map((inv) => (
              <tr key={inv.id} style={styles.row}>
                <td style={styles.td}>{inv.invoice_number}</td>
                <td style={styles.td}>
                  {/* inv.order is a plain integer PK from the serializer */}
                  {inv.order ? (
                    <Link to={`/admin/orders/${inv.order}`} style={styles.link}>
                      Order #{inv.order}
                    </Link>
                  ) : '—'}
                </td>
                <td style={styles.td}>{new Date(inv.issued_date).toLocaleDateString()}</td>
                <td style={styles.td}>
                  {inv.pdf_file ? (
                    <a href={inv.pdf_file} target="_blank" rel="noopener noreferrer" style={styles.link}>
                      View PDF
                    </a>
                  ) : '—'}
                </td>
                <td style={styles.td}>
                  <Link to={`/admin/invoices/${inv.id}/edit`} style={styles.actionLink}>Edit</Link>
                  <button onClick={() => handleDelete(inv.id)} style={styles.deleteBtn}>Delete</button>
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