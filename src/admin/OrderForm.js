import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrder, createOrder, updateOrder, getCustomers, getServices } from './api';

export default function OrderForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const [form, setForm] = useState({
    customer_id: '',
    services: [],
    status: 'received',
    notes: '',
  });
  const [customers, setCustomers] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([getCustomers(), getServices()])
      .then(([cRes, sRes]) => {
        setCustomers(cRes.data.results || cRes.data);
        setServices(sRes.data.results || sRes.data);
      })
      .catch(() => setError('Failed to load customers or services'));

    if (isEditing) {
      getOrder(id)
        .then((res) => {
          const order = res.data;
          setForm({
            customer_id: order.customer.id,
            services: order.order_services.map((os) => os.service),
            status: order.status,
            notes: order.notes,
          });
          setLoading(false);
        })
        .catch(() => setError('Failed to load order'));
    } else {
      setLoading(false);
    }
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleServiceSelect = (e) => {
    const selected = Array.from(e.target.selectedOptions, (opt) => parseInt(opt.value));
    setForm((prev) => ({ ...prev, services: selected }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    try {
      if (isEditing) {
        await updateOrder(id, form);
      } else {
        await createOrder(form);
      }
      navigate('/admin/orders');
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
        {isEditing ? 'Edit Order' : 'New Order'}
      </h1>
      {error && <p style={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit} style={styles.card}>
        <div style={styles.field}>
          <label style={styles.label}>Customer *</label>
          <select name="customer_id" value={form.customer_id} onChange={handleChange} required style={styles.select}>
            <option value="">Select customer</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.phone})
              </option>
            ))}
          </select>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Services *</label>
          <select
            multiple
            value={form.services}
            onChange={handleServiceSelect}
            required
            style={{ ...styles.select, height: '120px' }}
          >
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} - R {s.price}
              </option>
            ))}
          </select>
          <small style={styles.hint}>Hold Ctrl/Cmd to select multiple</small>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Status</label>
          <select name="status" value={form.status} onChange={handleChange} style={styles.select}>
            <option value="received">Received</option>
            <option value="inspecting">Inspecting</option>
            <option value="cleaning">Cleaning</option>
            <option value="ready">Ready</option>
            <option value="collected">Collected</option>
            <option value="delivered">Delivered</option>
          </select>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Notes (damage/stain)</label>
          <textarea
            name="notes"
            value={form.notes}
            onChange={handleChange}
            rows={3}
            style={styles.textarea}
          />
        </div>

        <div style={styles.buttonGroup}>
          <button type="submit" style={styles.saveBtn} disabled={saving}>
            {saving ? 'Saving…' : 'Save Order'}
          </button>
          <button type="button" onClick={() => navigate('/admin/orders')} style={styles.cancelBtn}>
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

const styles = {
  card: { background: '#fff', padding: '32px', borderRadius: '10px', boxShadow: '0 4px 14px rgba(0,0,0,.08)', maxWidth: '700px' },
  field: { marginBottom: '16px' },
  label: { display: 'block', fontSize: '0.85rem', color: '#6B7280', marginBottom: '5px', fontWeight: 500 },
  select: { width: '100%', padding: '10px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '0.95rem' },
  textarea: { width: '100%', padding: '10px', border: '1px solid #E5E7EB', borderRadius: '6px', fontSize: '0.9rem', resize: 'vertical', boxSizing: 'border-box' },
  hint: { fontSize: '0.75rem', color: '#6B7280', marginTop: '4px', display: 'block' },
  saveBtn: { background: '#1E3A8A', color: '#fff', padding: '11px 28px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.95rem' },
  cancelBtn: { background: '#F3F4F6', color: '#1F2937', padding: '11px 28px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.95rem' },
  buttonGroup: { display: 'flex', gap: '12px', marginTop: '8px' },
  error: { color: '#EF4444', marginBottom: '14px', background: '#FEF2F2', padding: '10px', borderRadius: '6px' },
};