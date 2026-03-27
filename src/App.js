import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
  Outlet,
} from "react-router-dom";
import { getToken } from "./admin/api";

// Public layout components
import Header from "./GlobalComponents/Header";
import Footer from "./GlobalComponents/Footer";
import ScrollToTop from "./GlobalComponents/ScrollToTop";

// Public pages
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Careers from "./pages/Careers/Careers";
import Projects from "./pages/Projects/Projects";
import Services from "./pages/Services/Services";
import Contacts from "./pages/Contacts/Contacts";
import TrackOrder from "./pages/TrackOrder/TrackOrder";

// Admin components
import AdminLayout from "./admin/AdminLayout";
import Login from "./admin/Login";
import Dashboard from "./admin/Dashboard";
import OrderList from "./admin/OrderList";
import OrderForm from "./admin/OrderForm";
import OrderDetail from "./admin/OrderDetail";
import ServiceList from "./admin/ServiceList";
import ServiceForm from "./admin/ServiceForm";
import CustomerList from "./admin/CustomerList";
import CustomerForm from "./admin/CustomerForm";
import PaymentList from "./admin/PaymentList";
import PaymentForm from "./admin/PaymentForm";
import InvoiceList from "./admin/InvoiceList";
import InvoiceForm from "./admin/InvoiceForm";
import DocumentList from "./admin/DocumentList";
import DocumentForm from "./admin/DocumentForm";
import ContactList from "./admin/ContactList";
import AuditLogList from "./admin/AuditLogList";

// Protected route wrapper for admin
const ProtectedRoute = ({ children }) => {
  return getToken() ? children : <Navigate to="/admin/login" replace />;
};

// Layout for public pages
const PublicLayout = () => {
  const location = useLocation();
  const hideFooter = location.pathname === "/contact";

  return (
    <>
      <ScrollToTop />
      <Header />
      <main style={{ padding: 0, margin: 0 }}>
        <Outlet />
      </main>
      {!hideFooter && <Footer />}
    </>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Admin login – no layout */}
        <Route path="/admin/login" element={<Login />} />

        {/* Admin routes with layout and protection */}
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

        {/* Public routes with layout */}
        <Route path="/" element={<PublicLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="careers" element={<Careers />} />
          <Route path="projects" element={<Projects />} />
          <Route path="services" element={<Services />} />
          <Route path="contact" element={<Contacts />} />
          <Route path="track" element={<TrackOrder />} />
        </Route>

        {/* 404 – catch-all */}
        <Route
          path="*"
          element={<div style={{ padding: 40 }}>404 – Page not found</div>}
        />
      </Routes>
    </BrowserRouter>
  );
}