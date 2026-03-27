from django.db import models
from django.utils import timezone

class Service(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name


class Customer(models.Model):
    name = models.CharField(max_length=200)
    phone = models.CharField(max_length=20)
    email = models.EmailField(blank=True)
    address = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name


class Order(models.Model):
    STATUS_CHOICES = [
        ('received', 'Received'),
        ('inspecting', 'Inspecting'),
        ('cleaning', 'Cleaning'),
        ('ready', 'Ready'),
        ('collected', 'Collected'),
        ('delivered', 'Delivered'),
    ]
    PAYMENT_STATUS = [
        ('pending', 'Pending'),
        ('partial', 'Partially Paid'),
        ('paid', 'Paid'),
    ]
    PAYMENT_METHOD = [
        ('cash', 'Cash'),
        ('card', 'Card'),
        ('eft', 'EFT'),
    ]

    order_number = models.CharField(max_length=20, unique=True, blank=True)
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name='orders')
    services = models.ManyToManyField(Service, through='OrderService')
    notes = models.TextField(blank=True, help_text="Damage/stain notes")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='received')
    total_amount = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS, default='pending')
    payment_method = models.CharField(max_length=10, choices=PAYMENT_METHOD, blank=True)
    payment_date = models.DateTimeField(null=True, blank=True)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def save(self, *args, **kwargs):
        if not self.order_number:
            today = timezone.now().strftime('%Y%m%d')
            last = Order.objects.filter(order_number__startswith=f'ORD-{today}').order_by('-order_number').first()
            seq = int(last.order_number.split('-')[-1]) + 1 if last else 1
            self.order_number = f'ORD-{today}-{seq:04d}'
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.order_number} - {self.customer.name}"


class OrderService(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='order_services')
    service = models.ForeignKey(Service, on_delete=models.CASCADE)
    quantity = models.PositiveIntegerField(default=1)
    price_at_time = models.DecimalField(max_digits=10, decimal_places=2)

    def save(self, *args, **kwargs):
        if not self.price_at_time:
            self.price_at_time = self.service.price
        super().save(*args, **kwargs)


class Payment(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE, related_name='payments')
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    method = models.CharField(max_length=10, choices=Order.PAYMENT_METHOD)
    date = models.DateTimeField(auto_now_add=True)
    reference = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return f"{self.order.order_number} - {self.amount} ({self.method})"


class Invoice(models.Model):
    order = models.OneToOneField(Order, on_delete=models.CASCADE, related_name='invoice')
    invoice_number = models.CharField(max_length=20, unique=True, blank=True)
    issued_date = models.DateTimeField(auto_now_add=True)
    pdf_file = models.FileField(upload_to='invoices/', blank=True)

    def save(self, *args, **kwargs):
        if not self.invoice_number:
            today = timezone.now().strftime('%Y%m%d')
            last = Invoice.objects.filter(invoice_number__startswith=f'INV-{today}').order_by('-invoice_number').first()
            seq = int(last.invoice_number.split('-')[-1]) + 1 if last else 1
            self.invoice_number = f'INV-{today}-{seq:04d}'
        super().save(*args, **kwargs)


class Document(models.Model):
    DOCUMENT_TYPES = [
        ('permit', 'Permit'),
        ('certificate', 'Certificate'),
        ('receipt', 'Receipt'),
        ('invoice', 'Invoice'),
        ('other', 'Other'),
    ]
    name = models.CharField(max_length=200)
    document_type = models.CharField(max_length=20, choices=DOCUMENT_TYPES)
    file = models.FileField(upload_to='documents/')
    uploaded_at = models.DateTimeField(auto_now_add=True)


class AuditLog(models.Model):
    user = models.ForeignKey('auth.User', on_delete=models.SET_NULL, null=True, blank=True)
    action = models.CharField(max_length=100)
    model_name = models.CharField(max_length=50)
    object_id = models.PositiveIntegerField()
    changes = models.JSONField(default=dict)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user} - {self.action} on {self.model_name} {self.object_id}"


class ContactMessage(models.Model):
    name = models.CharField(max_length=100)
    email = models.EmailField()
    message = models.TextField()
    submitted_at = models.DateTimeField(auto_now_add=True)
    is_read = models.BooleanField(default=False)

    def __str__(self):
        return f"Message from {self.name}"


class SiteVisit(models.Model):
    PAGE_CHOICES = [
        ('home', 'Home'),
        ('services', 'Services'),
        ('track', 'Track Order'),
        ('contact', 'Contact'),
    ]
    page = models.CharField(max_length=20, choices=PAGE_CHOICES, default='home')
    visited_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.page} visit @ {self.visited_at}"