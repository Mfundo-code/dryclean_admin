import React, { useEffect, useState } from 'react';
import { getMessages, updateMessage } from './api';

export default function ContactList() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(null);

  const load = () => {
    getMessages()
      .then((res) => setMessages(res.data.results ?? res.data))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const markRead = async (id) => {
    await updateMessage(id, { is_read: true });
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, is_read: true } : m)));
  };

  if (loading) return <p>Loading…</p>;

  return (
    <div>
      <h1 style={{ color: '#1E3A8A', marginBottom: '24px' }}>Contact Messages</h1>

      {messages.length === 0 && <p style={{ color: '#6B7280' }}>No messages yet.</p>}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {messages.map((msg) => (
          <div
            key={msg.id}
            style={{ ...styles.card, borderLeft: msg.is_read ? '4px solid #E5E7EB' : '4px solid #3B82F6' }}
          >
            <div style={styles.msgHeader} onClick={() => setExpanded(expanded === msg.id ? null : msg.id)}>
              <div>
                <span style={styles.name}>{msg.name}</span>
                {!msg.is_read && <span style={styles.unreadBadge}>New</span>}
                <div style={styles.email}>{msg.email}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={styles.date}>{new Date(msg.submitted_at).toLocaleDateString()}</div>
                <span style={styles.toggle}>{expanded === msg.id ? '▲ hide' : '▼ show'}</span>
              </div>
            </div>

            {expanded === msg.id && (
              <div style={styles.msgBody}>
                <p style={{ whiteSpace: 'pre-wrap', color: '#1F2937', lineHeight: 1.6 }}>{msg.message}</p>
                {!msg.is_read && (
                  <button onClick={() => markRead(msg.id)} style={styles.readBtn}>
                    Mark as Read
                  </button>
                )}
                <a href={`mailto:${msg.email}`} style={styles.replyLink}>Reply via email →</a>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  card: { background: '#fff', borderRadius: '10px', boxShadow: '0 4px 14px rgba(0,0,0,.07)', overflow: 'hidden' },
  msgHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '16px 20px', cursor: 'pointer' },
  name: { fontWeight: 600, color: '#1E3A8A', fontSize: '0.95rem', marginRight: '8px' },
  unreadBadge: { background: '#3B82F6', color: '#fff', fontSize: '0.72rem', padding: '2px 8px', borderRadius: '10px', fontWeight: 600 },
  email: { fontSize: '0.8rem', color: '#6B7280', marginTop: '2px' },
  date: { fontSize: '0.8rem', color: '#6B7280' },
  toggle: { fontSize: '0.78rem', color: '#3B82F6', cursor: 'pointer' },
  msgBody: { padding: '0 20px 18px', borderTop: '1px solid #E5E7EB' },
  readBtn: { background: '#1E3A8A', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: '6px', cursor: 'pointer', marginRight: '12px', fontSize: '0.85rem' },
  replyLink: { color: '#1E3A8A', fontSize: '0.85rem', fontWeight: 500 },
};