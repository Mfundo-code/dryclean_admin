import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPayment, createPayment, updatePayment, getOrders } from './api';

const EMPTY = {
  order: '',
  amount: '',
  method: 'cash',
  reference: '',
};

export default function PaymentForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const [form, setForm] = useState(EMPTY);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Load all orders so staff can pick which order this payment is for
    getOrders()
      .then((res) => setOrders(res.data.results ?? res.data))
      .catch(() => setError('Failed to load orders.'));

    if (!isEditing) return;

    getPayment(id)
      .then((res) => setForm(res.data))
      .catch(() => setError('Failed to load payment.'))
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
        await updatePayment(id, form);
      } else {
        await createPayment(form);
      }
      navigate('/admin/payments');
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
        {isEditing ? 'Edit Payment' : 'New Payment'}
      </h1>

      {error && <p style={styles.error}>{error}</p>}

      <form onSubmit={handleSubmit} style={styles.card}>

        <div style={styles.field}>
          <label style={styles.label}>Order *</label>
          <select
            name="order"
            value={form.order}
            onChange={handleChange}
            required
            style={styles.select}
          >
            <option value="">Select order</option>
            {orders.map((o) => (
              <option key={o.id} value={o.id}>
                #{o.order_number} — {o.customer.name} (R {o.total_amount})
              </option>
            ))}
          </select>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Amount (R) *</label>
          <input
            type="number"
            step="0.01"
            min="0.01"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            required
            placeholder="e.g. 150.00"
            style={styles.input}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Payment Method *</label>
          <select
            name="method"
            value={form.method}
            onChange={handleChange}
            required
            style={styles.select}
          >
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="eft">EFT</option>
          </select>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Reference (optional)</label>
          <input
            type="text"
            name="reference"
            value={form.reference}
            onChange={handleChange}
            placeholder="EFT reference or card receipt number"
            style={styles.input}
          />
          <small style={styles.hint}>
            Use this for EFT bank reference numbers or card machine receipt numbers.
          </small>
        </div>

        <div style={styles.buttonGroup}>
          <button type="submit" style={styles.saveBtn} disabled={saving}>
            {saving ? 'Saving…' : 'Save Payment'}
          </button>
          <button
            type="button"
            onClick={() => navigate('/admin/payments')}
            style={styles.cancelBtn}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

const styles = {
  card: {
    background: '#fff',
    padding: '32px',
    borderRadius: '10px',
    boxShadow: '0 4px 14px rgba(0,0,0,.08)',
    maxWidth: '600px',
  },
  field: { marginBottom: '20px' },
  label: {
    display: 'block',
    fontSize: '0.85rem',
    color: '#6B7280',
    marginBottom: '6px',
    fontWeight: 500,
  },
  input: {
    width: '100%',
    padding: '10px',
    border: '1px solid #E5E7EB',
    borderRadius: '6px',
    fontSize: '0.95rem',
    boxSizing: 'border-box',
  },
  select: {
    width: '100%',
    padding: '10px',
    border: '1px solid #E5E7EB',
    borderRadius: '6px',
    fontSize: '0.95rem',
  },
  hint: {
    display: 'block',
    fontSize: '0.75rem',
    color: '#9CA3AF',
    marginTop: '4px',
  },
  saveBtn: {
    background: '#1E3A8A',
    color: '#fff',
    padding: '11px 28px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.95rem',
  },
  cancelBtn: {
    background: '#F3F4F6',
    color: '#1F2937',
    padding: '11px 28px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '0.95rem',
  },
  buttonGroup: { display: 'flex', gap: '12px', marginTop: '8px' },
  error: {
    color: '#EF4444',
    marginBottom: '14px',
    background: '#FEF2F2',
    padding: '10px',
    borderRadius: '6px',
  },
};