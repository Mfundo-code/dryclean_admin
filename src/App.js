import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { getToken } from './admin/api';

import AdminLayout from './admin/AdminLayout';
import Login from './admin/Login';
import Dashboard from './admin/Dashboard';
import OrderList from './admin/OrderList';
import OrderForm from './admin/OrderForm';
import OrderDetail from './admin/OrderDetail';
import ServiceList from './admin/ServiceList';
import ServiceForm from './admin/ServiceForm';
import CustomerList from './admin/CustomerList';
import CustomerForm from './admin/CustomerForm';
import PaymentList from './admin/PaymentList';
import PaymentForm from './admin/PaymentForm';
import InvoiceList from './admin/InvoiceList';
import InvoiceForm from './admin/InvoiceForm';
import DocumentList from './admin/DocumentList';
import DocumentForm from './admin/DocumentForm';
import ContactList from './admin/ContactList';
import AuditLogList from './admin/AuditLogList';

const ProtectedRoute = ({ children }) => {
  return getToken() ? children : <Navigate to="/admin/login" replace />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/admin" replace />} />
        <Route path="/admin/login" element={<Login />} />

        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="orders" element={<OrderList />} />
          <Route path="orders/new" element={<OrderForm />} />
          <Route path="orders/:id/edit" element={<OrderForm />} />
          <Route path="orders/:id" element={<OrderDetail />} />
          <Route path="services" element={<ServiceList />} />
          <Route path="services/new" element={<ServiceForm />} />
          <Route path="services/:id/edit" element={<ServiceForm />} />
          <Route path="customers" element={<CustomerList />} />
          <Route path="customers/new" element={<CustomerForm />} />
          <Route path="customers/:id/edit" element={<CustomerForm />} />
          <Route path="payments" element={<PaymentList />} />
          <Route path="payments/new" element={<PaymentForm />} />
          <Route path="payments/:id/edit" element={<PaymentForm />} />
          <Route path="invoices" element={<InvoiceList />} />
          <Route path="invoices/new" element={<InvoiceForm />} />
          <Route path="invoices/:id/edit" element={<InvoiceForm />} />
          <Route path="documents" element={<DocumentList />} />
          <Route path="documents/new" element={<DocumentForm />} />
          <Route path="documents/:id/edit" element={<DocumentForm />} />
          <Route path="messages" element={<ContactList />} />
          <Route path="audit-logs" element={<AuditLogList />} />
        </Route>

        <Route path="*" element={<div style={{ padding: 40 }}>404 – Page not found</div>} />
      </Routes>
    </BrowserRouter>
  );
}