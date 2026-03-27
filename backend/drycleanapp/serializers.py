from rest_framework import serializers
from .models import (
    Service, Customer, Order, OrderService, Payment,
    Invoice, Document, ContactMessage, SiteVisit, AuditLog
)

# ---- Public serializers ----
class PublicServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = ['id', 'name', 'description', 'price']


class PublicOrderCreateSerializer(serializers.ModelSerializer):
    customer_name = serializers.CharField(write_only=True)
    customer_phone = serializers.CharField(write_only=True)
    customer_email = serializers.EmailField(write_only=True, required=False)
    customer_address = serializers.CharField(write_only=True, required=False)
    services = serializers.ListField(child=serializers.IntegerField(), write_only=True)

    class Meta:
        model = Order
        fields = [
            'customer_name', 'customer_phone', 'customer_email', 'customer_address',
            'services', 'notes'
        ]

    def create(self, validated_data):
        customer_data = {
            'name': validated_data.pop('customer_name'),
            'phone': validated_data.pop('customer_phone'),
            'email': validated_data.pop('customer_email', ''),
            'address': validated_data.pop('customer_address', ''),
        }
        services_ids = validated_data.pop('services')
        customer, _ = Customer.objects.get_or_create(phone=customer_data['phone'], defaults=customer_data)
        order = Order.objects.create(customer=customer, **validated_data)
        total = 0
        for sid in services_ids:
            service = Service.objects.get(id=sid)
            OrderService.objects.create(order=order, service=service, price_at_time=service.price, quantity=1)
            total += service.price
        order.total_amount = total
        order.save()
        return order


class PublicContactSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = ['name', 'email', 'message']


class PublicOrderStatusSerializer(serializers.ModelSerializer):
    status_display = serializers.CharField(source='get_status_display', read_only=True)

    class Meta:
        model = Order
        fields = ['order_number', 'status', 'status_display', 'updated_at']


# ---- Admin serializers ----
class ServiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Service
        fields = '__all__'


class CustomerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Customer
        fields = '__all__'


class OrderServiceSerializer(serializers.ModelSerializer):
    service_name = serializers.ReadOnlyField(source='service.name')

    class Meta:
        model = OrderService
        fields = ['id', 'service', 'service_name', 'quantity', 'price_at_time']


class PaymentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Payment
        fields = '__all__'
        read_only_fields = ['date']


class InvoiceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Invoice
        fields = '__all__'
        read_only_fields = ['invoice_number', 'issued_date']


class DocumentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Document
        fields = '__all__'


class AuditLogSerializer(serializers.ModelSerializer):
    username = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = AuditLog
        fields = '__all__'


class ContactMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactMessage
        fields = '__all__'
        read_only_fields = ['submitted_at']


class SiteVisitSerializer(serializers.ModelSerializer):
    class Meta:
        model = SiteVisit
        fields = '__all__'


class OrderSerializer(serializers.ModelSerializer):
    customer = CustomerSerializer(read_only=True)
    customer_id = serializers.PrimaryKeyRelatedField(
        queryset=Customer.objects.all(), source='customer', write_only=True
    )
    services = serializers.PrimaryKeyRelatedField(
        many=True, queryset=Service.objects.all(), write_only=True
    )
    # FIX: removed redundant source='order_services' — field name already matches
    order_services = OrderServiceSerializer(many=True, read_only=True)
    payments = PaymentSerializer(many=True, read_only=True)
    invoice = InvoiceSerializer(read_only=True)
    status_display = serializers.CharField(source='get_status_display', read_only=True)
    payment_status_display = serializers.CharField(source='get_payment_status_display', read_only=True)

    class Meta:
        model = Order
        fields = '__all__'
        read_only_fields = ['order_number', 'total_amount', 'created_at', 'updated_at']

    def create(self, validated_data):
        services = validated_data.pop('services')
        customer = validated_data.pop('customer')
        order = Order.objects.create(customer=customer, **validated_data)
        total = 0
        for service in services:
            OrderService.objects.create(order=order, service=service, price_at_time=service.price, quantity=1)
            total += service.price
        order.total_amount = total
        order.save()
        return order

    def update(self, instance, validated_data):
        services = validated_data.pop('services', None)
        instance = super().update(instance, validated_data)
        if services is not None:
            instance.order_services.all().delete()
            total = 0
            for service in services:
                OrderService.objects.create(order=instance, service=service, price_at_time=service.price, quantity=1)
                total += service.price
            instance.total_amount = total
            instance.save()
        return instance