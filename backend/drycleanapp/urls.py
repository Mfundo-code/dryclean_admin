from django.urls import path
from . import views

urlpatterns = [
    # Auth
    path('auth/login/', views.LoginView.as_view(), name='login'),
    path('auth/refresh/', views.TokenRefreshView.as_view(), name='token-refresh'),

    # Public
    path('services/', views.PublicServiceListView.as_view(), name='public-services'),
    path('order/create/', views.PublicOrderCreateView.as_view(), name='public-order-create'),
    path('order/status/', views.PublicOrderStatusView.as_view(), name='public-order-status'),
    path('contact/', views.PublicContactView.as_view(), name='public-contact'),
    path('track/visit/', views.TrackVisitView.as_view(), name='track-visit'),

    # Admin
    path('admin/stats/', views.AdminDashboardStatsView.as_view(), name='admin-stats'),
    path('admin/services/', views.AdminServiceListCreateView.as_view(), name='admin-service-list'),
    path('admin/services/<int:pk>/', views.AdminServiceDetailView.as_view(), name='admin-service-detail'),
    path('admin/customers/', views.AdminCustomerListCreateView.as_view(), name='admin-customer-list'),
    path('admin/customers/<int:pk>/', views.AdminCustomerDetailView.as_view(), name='admin-customer-detail'),
    path('admin/orders/', views.AdminOrderListCreateView.as_view(), name='admin-order-list'),
    path('admin/orders/<int:pk>/', views.AdminOrderDetailView.as_view(), name='admin-order-detail'),
    path('admin/payments/', views.AdminPaymentListCreateView.as_view(), name='admin-payment-list'),
    path('admin/payments/<int:pk>/', views.AdminPaymentDetailView.as_view(), name='admin-payment-detail'),
    path('admin/invoices/', views.AdminInvoiceListCreateView.as_view(), name='admin-invoice-list'),
    path('admin/invoices/<int:pk>/', views.AdminInvoiceDetailView.as_view(), name='admin-invoice-detail'),
    path('admin/documents/', views.AdminDocumentListCreateView.as_view(), name='admin-document-list'),
    path('admin/documents/<int:pk>/', views.AdminDocumentDetailView.as_view(), name='admin-document-detail'),
    path('admin/contact/', views.AdminContactListView.as_view(), name='admin-contact-list'),
    path('admin/contact/<int:pk>/', views.AdminContactDetailView.as_view(), name='admin-contact-detail'),
    path('admin/orders/<int:order_id>/invoice/', views.AdminGenerateInvoiceView.as_view(), name='admin-generate-invoice'),
    path('admin/audit-logs/', views.AdminAuditLogListView.as_view(), name='admin-audit-logs'),
]