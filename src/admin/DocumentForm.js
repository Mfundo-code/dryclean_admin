import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getDocument, uploadDocument, updateDocument } from './api';

const EMPTY = {
  name: '',
  document_type: 'other',
  file: null,
};

export default function DocumentForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  const [form, setForm] = useState(EMPTY);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isEditing) return;
    getDocument(id)
      .then((res) => setForm(res.data))
      .catch(() => setError('Failed to load document.'))
      .finally(() => setLoading(false));
  }, [id, isEditing]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'file') {
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
        await updateDocument(id, form);
      } else {
        await uploadDocument(form);
      }
      navigate('/admin/documents');
    } catch (err) {
      const data = err.response?.data;
      setError(data ? JSON.stringify(data) : 'Upload failed.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p>Loading…</p>;

  return (
    <div>
      <h1 style={{ color: '#1B3D2F', marginBottom: '24px' }}>
        {isEditing ? 'Edit Document' : 'Upload Document'}
      </h1>
      {error && <p style={styles.error}>{error}</p>}
      <form onSubmit={handleSubmit} style={styles.card}>
        <div style={styles.field}>
          <label style={styles.label}>Name *</label>
          <input name="name" value={form.name} onChange={handleChange} required style={styles.input} />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Document Type *</label>
          <select name="document_type" value={form.document_type} onChange={handleChange} style={styles.select}>
            <option value="permit">Permit</option>
            <option value="certificate">Certificate</option>
            <option value="receipt">Receipt</option>
            <option value="invoice">Invoice</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>File *</label>
          <input type="file" name="file" onChange={handleChange} required={!isEditing} accept=".pdf,.jpg,.png,.docx" style={styles.fileInput} />
          {isEditing && <small>Leave empty to keep current file.</small>}
        </div>

        <div style={styles.buttonGroup}>
          <button type="submit" style={styles.saveBtn} disabled={saving}>
            {saving ? 'Uploading…' : 'Save Document'}
          </button>
          <button type="button" onClick={() => navigate('/admin/documents')} style={styles.cancelBtn}>
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
  select: { width: '100%', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', fontSize: '0.95rem' },
  fileInput: { width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '6px' },
  saveBtn: { background: '#1B3D2F', color: '#fff', padding: '11px 28px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.95rem' },
  cancelBtn: { background: '#eee', color: '#333', padding: '11px 28px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '0.95rem' },
  buttonGroup: { display: 'flex', gap: '12px', marginTop: '8px' },
  error: { color: '#c0392b', marginBottom: '14px', background: '#fdecea', padding: '10px', borderRadius: '6px' },
};