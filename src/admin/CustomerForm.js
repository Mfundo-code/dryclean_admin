import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCustomer, createCustomer, updateCustomer } from './api';

const EMPTY = {
  name: '',
  phone: '',
  email: '',
  address: '',
};

export default function CustomerForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEditing) return;
    getCustomer(id)
      .then((res) => setForm(res.data))
      .catch(() => setError('Failed to load customer.'))
      .finally(() => setLoading(false));
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (isEditing) {
        await updateCustomer(id, form);
      } else {
        await createCustomer(form);
      }
      navigate('/admin/customers');
    } catch (err) {
      const data = err.response?.data;
      setError(data ? JSON.stringify(data) : 'Save failed.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading…</p>;

  return (
    <div>
      <h1 style={{ color: '#1B3D2F', marginBottom: '24px' }}>
        {isEditing ? 'Edit Customer' : 'New Customer'}
      </h1>
      {error && <p style={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit} style={styles.card}>
        <div style={styles.field}>
          <label style={styles.label}>Name *</label>
          <input name="name" value={form.name} onChange={handleChange} required style={styles.input} />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Phone *</label>
          <input name="phone" value={form.phone} onChange={handleChange} required style={styles.input} />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Email</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} style={styles.input} />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Address</label>
          <textarea name="address" value={form.address} onChange={handleChange} rows={3} style={styles.textarea} />
        </div>

        <div style={styles.buttonGroup}>
          <button type="submit" style={styles.saveBtn} disabled={saving}>
            {saving ? 'Saving…' : 'Save Customer'}
          </button>
          <button type="button" onClick={() => navigate('/admin/customers')} style={styles.cancelBtn}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

const styles = {
  card: { background: '#fff', padding: '32px', borderRadius: '10px', boxShadow: '0 4px 14px rgba(0,0,0,.08)', maxWidth: '600px' },
  field: { marginBottom: '16px' },
  label: { display: 'block', fontSize: '0.85rem', color: '#555', marginBottom: '5px', fontWeight: 500 },
  input: { width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.95rem' },
  textarea: { width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.9rem', resize: 'vertical' },
  saveBtn: { background: '#1B3D2F', color: '#fff', padding: '11px 28px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.95rem' },
  cancelBtn: { background: '#eee', color: '#333', padding: '11px 28px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.95rem' },
  buttonGroup: { display: 'flex', gap: '12px', marginTop: '8px' },
  error: { color: '#c0392b', marginBottom: '14px', background: '#fdecea', padding: '10px', borderRadius: '6px' },
};