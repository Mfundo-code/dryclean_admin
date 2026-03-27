import datetime
from django.utils import timezone
from django.shortcuts import get_object_or_404
from django.core.mail import EmailMultiAlternatives
from django.conf import settings
from django.db.models import Count, Sum
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .utils import generate_invoice_pdf
from django.http import HttpResponse

from .models import (
    Service, Customer, Order, OrderService, Payment,
    Invoice, Document, ContactMessage, SiteVisit, AuditLog
)
from .serializers import (
    PublicServiceSerializer, PublicOrderCreateSerializer, PublicContactSerializer,
    PublicOrderStatusSerializer, ServiceSerializer, CustomerSerializer,
    OrderSerializer, PaymentSerializer, InvoiceSerializer, DocumentSerializer,
    ContactMessageSerializer, SiteVisitSerializer, AuditLogSerializer
)


# ── Auth ───────────────────────────────────────────────────────────────────────
class LoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        username = request.data.get('username', '').strip()
        password = request.data.get('password', '').strip()
        if not username or not password:
            return Response({'detail': 'Username and password required.'}, status=400)
        user = authenticate(request, username=username, password=password)
        if not user:
            return Response({'detail': 'Invalid credentials.'}, status=401)
        if not user.is_staff:
            return Response({'detail': 'You do not have admin access.'}, status=403)
        refresh = RefreshToken.for_user(user)
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'username': user.username,
        })


class TokenRefreshView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        refresh_token = request.data.get('refresh')
        if not refresh_token:
            return Response({'detail': 'Refresh token required.'}, status=400)
        try:
            refresh = RefreshToken(refresh_token)
            return Response({'access': str(refresh.access_token)})
        except Exception:
            return Response({'detail': 'Invalid or expired refresh token.'}, status=401)


# ── Public views ───────────────────────────────────────────────────────────────
class PublicServiceListView(generics.ListAPIView):
    serializer_class = PublicServiceSerializer
    permission_classes = [permissions.AllowAny]
    queryset = Service.objects.filter(is_active=True)


class PublicOrderCreateView(generics.CreateAPIView):
    serializer_class = PublicOrderCreateSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        order = serializer.save()
        self._send_confirmation(order)

    def _send_confirmation(self, order):
        if not order.customer.email:
            return
        subject = f"Order Confirmation - #{order.order_number}"
        plain_body = (
            f"Dear {order.customer.name},\n\n"
            f"Thank you for your order at Lebowakgomo Dry Cleaners.\n"
            f"Order Number: {order.order_number}\n\n"
            f"Services:\n"
        )
        for item in order.order_services.all():
            plain_body += f"- {item.service.name} x{item.quantity} – R {item.price_at_time}\n"
        plain_body += f"\nTotal: R {order.total_amount}\n"
        plain_body += f"Status: {order.get_status_display()}\n\n"
        plain_body += "You can track your order status using your order number and phone number on our website.\n\n"
        plain_body += "Lebowakgomo Dry Cleaners"

        html_body = f"""<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><title>Order Confirmation</title></head>
<body style="margin:0;padding:0;background:#F2F2EE;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F2F2EE;padding:40px 16px;"><tr><td align="center">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fff;border-radius:20px;overflow:hidden;border:1px solid rgba(0,0,0,0.05);box-shadow:0 12px 40px rgba(0,0,0,0.08);">
<tr><td style="height:6px;background:linear-gradient(90deg,#1B3D2F,#C9A53A);"></td></tr>
<tr><td style="padding:32px 36px 0;">
<div style="display:inline-block;background:#1B3D2F;border-radius:8px;padding:6px 16px;"><span style="color:#fff;font-size:0.7rem;font-weight:700;">LEBOWAKGOMO DRY CLEANERS</span></div>
</td></tr>
<tr><td style="padding:28px 36px 0;">
<p style="margin:0 0 8px;font-size:0.7rem;font-weight:700;color:#C9A53A;">✓ ORDER CONFIRMED</p>
<h1 style="margin:0;font-size:1.4rem;font-weight:700;color:#1B3D2F;">Thanks, {order.customer.name}!</h1>
<p style="margin:16px 0 0;color:#555;line-height:1.6;">Your order <strong>#{order.order_number}</strong> has been received.</p>
</td></tr>
<tr><td style="padding:24px 36px 0;">
<h3 style="margin:0 0 12px;color:#1B3D2F;">Services</h3>
<ul style="margin:0;padding-left:20px;color:#444;">
{"".join(f"<li>{item.service.name} x{item.quantity} – R {item.price_at_time}</li>" for item in order.order_services.all())}
</ul>
<p style="margin:16px 0 0;font-size:1.1rem;font-weight:600;">Total: R {order.total_amount}</p>
<p style="margin:8px 0 0;">Status: <strong>{order.get_status_display()}</strong></p>
</td></tr>
<tr><td style="padding:24px 36px 32px;border-top:1px solid #eee;margin-top:20px;">
<p style="margin:0;font-size:0.8rem;color:#888;">Track your order online with your order number and phone number.</p>
<p style="margin:16px 0 0;font-size:0.8rem;color:#1B3D2F;">Lebowakgomo Dry Cleaners</p>
</td></tr>
</table>
</td></tr></table>
</body>
</html>"""
        try:
            msg = EmailMultiAlternatives(subject, plain_body, settings.DEFAULT_FROM_EMAIL, [order.customer.email])
            msg.attach_alternative(html_body, "text/html")
            msg.send(fail_silently=False)
        except Exception as e:
            print(f"Order email error: {e}")


class PublicOrderStatusView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        order_number = request.query_params.get('order_number')
        phone = request.query_params.get('phone')
        if not order_number or not phone:
            return Response({'error': 'order_number and phone required'}, status=400)
        try:
            order = Order.objects.get(order_number=order_number, customer__phone=phone)
            serializer = PublicOrderStatusSerializer(order)
            return Response(serializer.data)
        except Order.DoesNotExist:
            return Response({'error': 'Order not found'}, status=404)


class PublicContactView(generics.CreateAPIView):
    serializer_class = PublicContactSerializer
    permission_classes = [permissions.AllowAny]

    def perform_create(self, serializer):
        contact = serializer.save()
        self._send_confirmation(contact)

    def _send_confirmation(self, contact):
        # Send to visitor
        subject = "We received your message – Lebowakgomo Dry Cleaners"
        plain_body = (
            f"Hi {contact.name},\n\n"
            f"Thank you for reaching out to Lebowakgomo Dry Cleaners.\n"
            f"We've received your message and will get back to you within 24 hours.\n\n"
            f"Your message:\n\"{contact.message}\"\n\n"
            f"Best regards,\nLebowakgomo Dry Cleaners"
        )
        html_body = f"""<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Message Received</title></head>
<body style="margin:0;padding:0;background:#F2F2EE;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F2F2EE;padding:40px 16px;"><tr><td align="center">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fff;border-radius:20px;overflow:hidden;border:1px solid rgba(0,0,0,0.05);">
<tr><td style="height:6px;background:linear-gradient(90deg,#1B3D2F,#C9A53A);"></td></tr>
<tr><td style="padding:32px 36px 0;"><div style="display:inline-block;background:#1B3D2F;border-radius:8px;padding:6px 16px;"><span style="color:#fff;font-size:0.7rem;font-weight:700;">LEBOWAKGOMO DRY CLEANERS</span></div></td></tr>
<tr><td style="padding:28px 36px 0;">
<p style="margin:0 0 8px;font-size:0.7rem;font-weight:700;color:#C9A53A;">✓ MESSAGE RECEIVED</p>
<h1 style="margin:0;font-size:1.4rem;font-weight:700;color:#1B3D2F;">Hi {contact.name}, we got your message!</h1>
<p style="margin:16px 0 0;color:#555;line-height:1.6;">Thank you for contacting Lebowakgomo Dry Cleaners. Our team will review your enquiry and respond within 24 hours.</p>
</td></tr>
<tr><td style="padding:24px 36px;"><div style="background:#f9f9f9;border-radius:8px;padding:16px;"><p style="margin:0;color:#1B3D2F;font-style:italic;">"{contact.message}"</p></div></td></tr>
<tr><td style="padding:0 36px 32px;"><p style="margin:0;font-size:0.8rem;color:#888;">We'll reply to {contact.email}</p><p style="margin:16px 0 0;font-size:0.8rem;color:#1B3D2F;">Lebowakgomo Dry Cleaners</p></td></tr>
</table>
</td></tr></table>
</body>
</html>"""
        try:
            msg = EmailMultiAlternatives(subject, plain_body, settings.DEFAULT_FROM_EMAIL, [contact.email])
            msg.attach_alternative(html_body, "text/html")
            msg.send(fail_silently=False)
        except Exception as e:
            print(f"Contact email error: {e}")

        # Alert to shop owner
        try:
            from django.core.mail import EmailMessage
            owner_msg = EmailMessage(
                subject=f"New contact message from {contact.name}",
                body=(
                    f"You have a new contact message from the website.\n\n"
                    f"Name: {contact.name}\nEmail: {contact.email}\n\n"
                    f"Message:\n{contact.message}\n\nReply to: {contact.email}"
                ),
                from_email=settings.DEFAULT_FROM_EMAIL,
                to=['mfundoknox@gmail.com'],
                reply_to=[contact.email],
            )
            owner_msg.send(fail_silently=False)
        except Exception as e:
            print(f"Owner alert error: {e}")


class TrackVisitView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        page = request.data.get('page', 'home')
        if page not in ['home', 'services', 'track', 'contact']:
            page = 'home'
        SiteVisit.objects.create(page=page)
        return Response({'ok': True}, status=201)


# ── Admin permission ───────────────────────────────────────────────────────────
class IsAdminOrStaff(permissions.BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and request.user.is_staff)


# ── Admin views ─────────────────────────────────────────────────────────────────
class AdminServiceListCreateView(generics.ListCreateAPIView):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    permission_classes = [IsAdminOrStaff]


class AdminServiceDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Service.objects.all()
    serializer_class = ServiceSerializer
    permission_classes = [IsAdminOrStaff]


class AdminCustomerListCreateView(generics.ListCreateAPIView):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    permission_classes = [IsAdminOrStaff]


class AdminCustomerDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Customer.objects.all()
    serializer_class = CustomerSerializer
    permission_classes = [IsAdminOrStaff]


class AdminOrderListCreateView(generics.ListCreateAPIView):
    queryset = Order.objects.prefetch_related('order_services', 'payments').select_related('customer')
    serializer_class = OrderSerializer
    permission_classes = [IsAdminOrStaff]

    def get_queryset(self):
        qs = super().get_queryset()
        status = self.request.query_params.get('status')
        if status:
            qs = qs.filter(status=status)
        return qs


class AdminOrderDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Order.objects.prefetch_related('order_services', 'payments').select_related('customer')
    serializer_class = OrderSerializer
    permission_classes = [IsAdminOrStaff]

    def perform_update(self, serializer):
        old_status = self.get_object().status
        order = serializer.save()
        if old_status != order.status and order.customer.email:
            subject = f"Order Status Update - #{order.order_number}"
            plain_body = (
                f"Dear {order.customer.name},\n\n"
                f"Your order #{order.order_number} status has been updated.\n"
                f"New status: {order.get_status_display()}\n\n"
                f"Lebowakgomo Dry Cleaners"
            )
            html_body = f"""<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><title>Order Status Update</title></head>
<body style="margin:0;padding:0;background:#F2F2EE;font-family:'Segoe UI',Arial,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F2F2EE;padding:40px 16px;"><tr><td align="center">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fff;border-radius:20px;overflow:hidden;border:1px solid rgba(0,0,0,0.05);">
<tr><td style="height:6px;background:linear-gradient(90deg,#1B3D2F,#C9A53A);"></td></tr>
<tr><td style="padding:32px 36px;"><h2 style="margin:0 0 16px;color:#1B3D2F;">Order Update, {order.customer.name}</h2>
<p style="margin:0 0 8px;color:#555;">Your order <strong>#{order.order_number}</strong> is now:</p>
<p style="margin:0 0 16px;font-size:1.2rem;font-weight:600;color:#C9A53A;">{order.get_status_display()}</p>
<p style="margin:0;color:#888;">Lebowakgomo Dry Cleaners</p></td></tr>
</table>
</td></tr></table>
</body>
</html>"""
            try:
                msg = EmailMultiAlternatives(subject, plain_body, settings.DEFAULT_FROM_EMAIL, [order.customer.email])
                msg.attach_alternative(html_body, "text/html")
                msg.send(fail_silently=False)
            except Exception as e:
                print(f"Status email error: {e}")


class AdminPaymentListCreateView(generics.ListCreateAPIView):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [IsAdminOrStaff]


class AdminPaymentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [IsAdminOrStaff]


class AdminInvoiceListCreateView(generics.ListCreateAPIView):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer
    permission_classes = [IsAdminOrStaff]


class AdminInvoiceDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer
    permission_classes = [IsAdminOrStaff]


class AdminDocumentListCreateView(generics.ListCreateAPIView):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    permission_classes = [IsAdminOrStaff]


class AdminDocumentDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Document.objects.all()
    serializer_class = DocumentSerializer
    permission_classes = [IsAdminOrStaff]


class AdminContactListView(generics.ListAPIView):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    permission_classes = [IsAdminOrStaff]


class AdminContactDetailView(generics.RetrieveUpdateAPIView):
    queryset = ContactMessage.objects.all()
    serializer_class = ContactMessageSerializer
    permission_classes = [IsAdminOrStaff]


class AdminAuditLogListView(generics.ListAPIView):
    queryset = AuditLog.objects.all().order_by('-timestamp')
    serializer_class = AuditLogSerializer
    permission_classes = [IsAdminOrStaff]


class AdminDashboardStatsView(APIView):
    permission_classes = [IsAdminOrStaff]

    def get(self, request):
        today = timezone.now().date()
        week_ago = today - datetime.timedelta(days=6)

        daily_sales = []
        for i in range(7):
            day = week_ago + datetime.timedelta(days=i)
            total = Payment.objects.filter(date__date=day).aggregate(total=Sum('amount'))['total'] or 0
            daily_sales.append({'date': day.strftime('%Y-%m-%d'), 'sales': float(total)})

        popular_services = list(OrderService.objects.values('service__name').annotate(count=Count('order')).order_by('-count')[:5])

        orders_by_status = list(Order.objects.values('status').annotate(count=Count('id')))

        unpaid_orders = Order.objects.exclude(payment_status='paid').count()
        repeat_customers = Customer.objects.annotate(order_count=Count('orders')).filter(order_count__gt=1).count()
        total_revenue = Payment.objects.aggregate(total=Sum('amount'))['total'] or 0

        return Response({
            'daily_sales': daily_sales,
            'popular_services': popular_services,
            'orders_by_status': orders_by_status,
            'unpaid_orders': unpaid_orders,
            'repeat_customers': repeat_customers,
            'total_revenue': float(total_revenue),
            'total_orders': Order.objects.count(),
            'total_customers': Customer.objects.count(),
            'unread_messages': ContactMessage.objects.filter(is_read=False).count(),
            'active_services': Service.objects.filter(is_active=True).count(),
        })

class AdminGenerateInvoiceView(APIView):
    permission_classes = [IsAdminOrStaff]

    def post(self, request, order_id):
        try:
            buffer = generate_invoice_pdf(order_id)
            response = HttpResponse(buffer, content_type='application/pdf')
            order = Order.objects.get(id=order_id)
            filename = f"invoice_{order.order_number}.pdf"
            response['Content-Disposition'] = f'attachment; filename="{filename}"'
            return response
        except Exception as e:
            return Response({'error': str(e)}, status=500)