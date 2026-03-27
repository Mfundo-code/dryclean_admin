import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getDocuments, deleteDocument } from './api';

export default function DocumentList() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    getDocuments()
      .then((res) => setDocs(res.data.results ?? res.data))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this document?')) return;
    await deleteDocument(id);
    load();
  };

  if (loading) return <p>Loading…</p>;

  return (
    <div>
      <div style={styles.header}>
        <h1 style={{ color: '#1E3A8A', margin: 0 }}>Documents</h1>
        <Link to="/admin/documents/new" style={styles.newBtn}>+ Upload Document</Link>
      </div>

      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.thead}>
              <th style={styles.th}>Name</th>
              <th style={styles.th}>Type</th>
              <th style={styles.th}>File</th>
              <th style={styles.th}>Uploaded</th>
              <th style={styles.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {docs.length === 0 && (
              <tr><td colSpan={5} style={{ padding: '20px', textAlign: 'center', color: '#6B7280' }}>No documents found.</td></tr>
            )}
            {docs.map((doc) => (
              <tr key={doc.id} style={styles.row}>
                <td style={styles.td}>{doc.name}</td>
                <td style={styles.td}>{doc.document_type}</td>
                <td style={styles.td}>
                  <a href={doc.file} target="_blank" rel="noopener noreferrer">View</a>
                </td>
                <td style={styles.td}>{new Date(doc.uploaded_at).toLocaleDateString()}</td>
                <td style={styles.td}>
                  <Link to={`/admin/documents/${doc.id}/edit`} style={styles.actionLink}>Edit</Link>
                  <button onClick={() => handleDelete(doc.id)} style={styles.deleteBtn}>Delete</button>
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