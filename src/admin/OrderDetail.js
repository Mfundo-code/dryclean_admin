import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getOrder, updateOrder, createPayment } from './api';
import api from './api';

export default function OrderDetail() {
  const { id } = useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newPayment, setNewPayment] = useState({ amount: '', method: 'cash', reference: '' });
  const [addingPayment, setAddingPayment] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [generatingInvoice, setGeneratingInvoice] = useState(false);

  useEffect(() => {
    if (!id || id === 'undefined') {
      setLoading(false);
      return;
    }
    getOrder(id)
      .then((res) => setOrder(res.data))
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [id]);

  const updateStatus = async (newStatus) => {
    setUpdating(true);
    await updateOrder(id, { status: newStatus });
    setOrder({ ...order, status: newStatus });
    setUpdating(false);
  };

  const addPayment = async () => {
    setAddingPayment(true);
    await createPayment({ order: id, ...newPayment });
    const refreshed = await getOrder(id);
    setOrder(refreshed.data);
    setNewPayment({ amount: '', method: 'cash', reference: '' });
    setAddingPayment(false);
  };

  const generateInvoice = async () => {
    setGeneratingInvoice(true);
    try {
      const response = await api.post(
        `/admin/orders/${id}/invoice/`,
        {},
        { responseType: 'blob' }
      );
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice_${order.order_number}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      alert('Invoice generated and saved successfully!');
      const refreshed = await getOrder(id);
      setOrder(refreshed.data);
    } catch (err) {
      console.error(err);
      alert('Failed to generate invoice. Please check backend logs.');
    } finally {
      setGeneratingInvoice(false);
    }
  };

  if (loading) return <p>Loading…</p>;
  if (!id || id === 'undefined') return <p>Invalid link — no order ID in URL.</p>;
  if (!order) return <p>Order not found.</p>;

  return (
    <div>
      <Link to="/admin/orders" style={styles.back}>← Back to Orders</Link>
      <h1 style={{ margin: '12px 0 24px', color: '#1E3A8A' }}>Order #{order.order_number}</h1>

      <div style={styles.grid}>
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Customer Info</h3>
          <Info label="Name">{order.customer.name}</Info>
          <Info label="Phone">{order.customer.phone}</Info>
          {order.customer.email && <Info label="Email">{order.customer.email}</Info>}
          {order.customer.address && <Info label="Address">{order.customer.address}</Info>}
        </div>

        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Order Details</h3>
          <Info label="Status">
            <select
              value={order.status}
              onChange={(e) => updateStatus(e.target.value)}
              style={styles.statusSelect}
              disabled={updating}
            >
              <option value="received">Received</option>
              <option value="inspecting">Inspecting</option>
              <option value="cleaning">Cleaning</option>
              <option value="ready">Ready</option>
              <option value="collected">Collected</option>
              <option value="delivered">Delivered</option>
            </select>
            {updating && <span style={{ marginLeft: 8 }}>⏳</span>}
          </Info>
          <Info label="Created">{new Date(order.created_at).toLocaleString()}</Info>
          <Info label="Notes">{order.notes || '—'}</Info>
        </div>
      </div>

      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Services</h3>
        <ul style={styles.list}>
          {order.order_services.map((os) => (
            <li key={os.id}>
              {os.service_name} x{os.quantity} – R {os.price_at_time}
            </li>
          ))}
        </ul>
        <p style={styles.total}>Total: <strong>R {order.total_amount}</strong></p>
        <p>Payment Status: <strong>{order.payment_status_display}</strong></p>
      </div>

      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Payments</h3>
        {order.payments.length === 0 && <p style={styles.empty}>No payments recorded.</p>}
        <ul style={styles.list}>
          {order.payments.map((p) => (
            <li key={p.id}>
              R {p.amount} ({p.method}) – {new Date(p.date).toLocaleString()}
              {p.reference && ` – Ref: ${p.reference}`}
            </li>
          ))}
        </ul>

        <div style={styles.paymentForm}>
          <h4>Add Payment</h4>
          <div style={styles.paymentRow}>
            <input
              type="number"
              placeholder="Amount"
              value={newPayment.amount}
              onChange={(e) => setNewPayment({ ...newPayment, amount: e.target.value })}
              style={styles.inputSmall}
            />
            <select
              value={newPayment.method}
              onChange={(e) => setNewPayment({ ...newPayment, method: e.target.value })}
              style={styles.selectSmall}
            >
              <option value="cash">Cash</option>
              <option value="card">Card</option>
              <option value="eft">EFT</option>
            </select>
            <input
              type="text"
              placeholder="Reference (optional)"
              value={newPayment.reference}
              onChange={(e) => setNewPayment({ ...newPayment, reference: e.target.value })}
              style={styles.inputSmall}
            />
            <button onClick={addPayment} disabled={addingPayment} style={styles.addPaymentBtn}>
              {addingPayment ? 'Adding…' : 'Add'}
            </button>
            <button onClick={generateInvoice} disabled={generatingInvoice} style={styles.generateBtn}>
              {generatingInvoice ? 'Generating…' : '📄 Generate Invoice'}
            </button>
          </div>
        </div>
      </div>

      {order.invoice && order.invoice.pdf_file && (
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Invoice</h3>
          <p>Invoice #{order.invoice.invoice_number}</p>
          <a href={order.invoice.pdf_file} target="_blank" rel="noopener noreferrer" style={styles.link}>
            View Invoice
          </a>
        </div>
      )}
    </div>
  );
}

const Info = ({ label, children }) => (
  <div style={{ display: 'flex', padding: '8px 0', borderBottom: '1px solid #f0f0f0' }}>
    <span style={{ width: '100px', color: '#6B7280', fontSize: '0.82rem', flexShrink: 0 }}>{label}</span>
    <span style={{ color: '#1F2937', fontSize: '0.9rem' }}>{children}</span>
  </div>
);

const styles = {
  back: { color: '#3B82F6', textDecoration: 'none', fontSize: '0.9rem' },
  grid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' },
  card: { background: '#fff', padding: '24px', borderRadius: '10px', boxShadow: '0 4px 14px rgba(0,0,0,.08)', marginBottom: '20px' },
  cardTitle: { color: '#1E3A8A', marginTop: 0, marginBottom: '16px' },
  statusSelect: { padding: '6px 10px', borderRadius: '4px', border: '1px solid #E5E7EB', fontSize: '0.9rem' },
  list: { margin: '0 0 16px', paddingLeft: '20px' },
  total: { fontSize: '1.1rem', fontWeight: 500, marginTop: 8 },
  empty: { color: '#6B7280', fontStyle: 'italic' },
  paymentForm: { marginTop: 20, borderTop: '1px solid #E5E7EB', paddingTop: 16 },
  paymentRow: { display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' },
  inputSmall: { padding: '8px', border: '1px solid #E5E7EB', borderRadius: '4px', fontSize: '0.9rem', flex: 1 },
  selectSmall: { padding: '8px', border: '1px solid #E5E7EB', borderRadius: '4px', fontSize: '0.9rem' },
  addPaymentBtn: { background: '#1E3A8A', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: '4px', cursor: 'pointer' },
  generateBtn: { background: '#3B82F6', color: '#fff', padding: '8px 20px', borderRadius: '6px', border: 'none', cursor: 'pointer', marginLeft: '10px' },
  link: { color: '#1E3A8A', textDecoration: 'none' },
};