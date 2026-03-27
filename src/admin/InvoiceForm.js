import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getInvoice, createInvoice, updateInvoice, getOrders } from './api';

const EMPTY = {
  order: '',
  pdf_file: null,
};

export default function InvoiceForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const [form, setForm] = useState(EMPTY);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    getOrders().then((res) => setOrders(res.data.results ?? res.data));
    if (!isEditing) return;
    getInvoice(id)
      .then((res) => setForm(res.data))
      .catch(() => setError('Failed to load invoice.'))
      .finally(() => setLoading(false));
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'pdf_file') {
      setForm((prev) => ({ ...prev, [name]: files[0] }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (isEditing) {
        await updateInvoice(id, form);
      } else {
        await createInvoice(form);
      }
      navigate('/admin/invoices');
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
        {isEditing ? 'Edit Invoice' : 'New Invoice'}
      </h1>
      {error && <p style={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit} style={styles.card}>
        <div style={styles.field}>
          <label style={styles.label}>Order *</label>
          <select name="order" value={form.order} onChange={handleChange} required style={styles.select}>
            <option value="">Select order</option>
            {orders.map((o) => (
              <option key={o.id} value={o.id}>
                #{o.order_number} - {o.customer.name}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>PDF File</label>
          <input type="file" name="pdf_file" onChange={handleChange} accept=".pdf" style={styles.fileInput} />
          {form.pdf_file && !isEditing && <small>File will be uploaded.</small>}
        </div>

        <div style={styles.buttonGroup}>
          <button type="submit" style={styles.saveBtn} disabled={saving}>
            {saving ? 'Saving…' : 'Save Invoice'}
          </button>
          <button type="button" onClick={() => navigate('/admin/invoices')} style={styles.cancelBtn}>
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
  select: { width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.95rem' },
  fileInput: { width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '6px' },
  saveBtn: { background: '#1B3D2F', color: '#fff', padding: '11px 28px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.95rem' },
  cancelBtn: { background: '#eee', color: '#333', padding: '11px 28px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.95rem' },
  buttonGroup: { display: 'flex', gap: '12px', marginTop: '8px' },
  error: { color: '#c0392b', marginBottom: '14px', background: '#fdecea', padding: '10px', borderRadius: '6px' },
};