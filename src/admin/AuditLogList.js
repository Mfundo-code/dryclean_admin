import React, { useEffect, useState } from 'react';
import { getAuditLogs } from './api';

export default function AuditLogList() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAuditLogs()
      .then((res) => setLogs(res.data.results ?? res.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading…</p>;

  return (
    <div>
      <h1 style={{ color: '#1E3A8A', marginBottom: '24px' }}>Audit Logs</h1>

      <div style={styles.tableWrap}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.thead}>
              <th style={styles.th}>Timestamp</th>
              <th style={styles.th}>User</th>
              <th style={styles.th}>Action</th>
              <th style={styles.th}>Model</th>
              <th style={styles.th}>Object ID</th>
              <th style={styles.th}>Changes</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 && (
              <tr><td colSpan={6} style={{ padding: '20px', textAlign: 'center', color: '#6B7280' }}>No logs found.</td></tr>
            )}
            {logs.map((log) => (
              <tr key={log.id} style={styles.row}>
                <td style={styles.td}>{new Date(log.timestamp).toLocaleString()}</td>
                <td style={styles.td}>{log.username || 'System'}</td>
                <td style={styles.td}>{log.action}</td>
                <td style={styles.td}>{log.model_name}</td>
                <td style={styles.td}>{log.object_id}</td>
                <td style={styles.td}><pre style={styles.pre}>{JSON.stringify(log.changes, null, 2)}</pre></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const styles = {
  tableWrap: { background: '#fff', borderRadius: '10px', boxShadow: '0 4px 14px rgba(0,0,0,.08)', overflow: 'auto' },
  table: { width: '100%', borderCollapse: 'collapse' },
  thead: { background: '#1E3A8A' },
  th: { color: '#fff', padding: '12px 14px', textAlign: 'left', fontWeight: 600, fontSize: '0.85rem' },
  row: { borderBottom: '1px solid #f0f0f0' },
  td: { padding: '12px 14px', fontSize: '0.9rem', color: '#1F2937' },
  pre: { margin: 0, fontSize: '0.8rem', whiteSpace: 'pre-wrap', fontFamily: 'monospace' },
};