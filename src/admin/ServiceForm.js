import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getService, createService, updateService } from './api';

const EMPTY = {
  name: '',
  description: '',
  price: '',
  is_active: true,
};

export default function ServiceForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEditing) return;
    getService(id)
      .then((res) => setForm(res.data))
      .catch(() => setError('Failed to load service.'))
      .finally(() => setLoading(false));
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (isEditing) {
        await updateService(id, form);
      } else {
        await createService(form);
      }
      navigate('/admin/services');
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
      <h1 style={{ color: '#1E3A8A', marginBottom: '24px' }}>
        {isEditing ? 'Edit Service' : 'New Service'}
      </h1>
      {error && <p style={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit} style={styles.card}>
        <div style={styles.field}>
          <label style={styles.label}>Name *</label>
          <input name="name" value={form.name} onChange={handleChange} required style={styles.input} />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={3} style={styles.textarea} />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Price (R) *</label>
          <input type="number" step="0.01" name="price" value={form.price} onChange={handleChange} required style={styles.input} />
        </div>

        <div style={styles.field}>
          <label style={{ ...styles.label, display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
            <input type="checkbox" name="is_active" checked={form.is_active} onChange={handleChange} />
            Active (visible to customers)
          </label>
        </div>

        <div style={styles.buttonGroup}>
          <button type="submit" style={styles.saveBtn} disabled={saving}>
            {saving ? 'Saving…' : 'Save Service'}
          </button>
          <button type="button" onClick={() => navigate('/admin/services')} style={styles.cancelBtn}>
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
  label: { display: 'block', fontSize: '0.85rem', color: '#6B7280', marginBottom: '5px', fontWeight: 500 },
  input: { width: '100%', padding: '10px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '0.95rem' },
  textarea: { width: '100%', padding: '10px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '0.9rem', resize: 'vertical' },
  saveBtn: { background: '#1E3A8A', color: '#fff', padding: '11px 28px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.95rem' },
  cancelBtn: { background: '#F3F4F6', color: '#1F2937', padding: '11px 28px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.95rem' },
  buttonGroup: { display: 'flex', gap: '12px', marginTop: '8px' },
  error: { color: '#EF4444', marginBottom: '14px', background: '#FEF2F2', padding: '10px', borderRadius: '6px' },
};