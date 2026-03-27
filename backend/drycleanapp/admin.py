from django.contrib import admin
from .models import (
    Service, Customer, Order, OrderService, Payment,
    Invoice, Document, ContactMessage, SiteVisit, AuditLog
)

class ServiceAdmin(admin.ModelAdmin):
    list_display = ('name', 'price', 'is_active')
    list_filter = ('is_active',)
    search_fields = ('name',)


class CustomerAdmin(admin.ModelAdmin):
    list_display = ('name', 'phone', 'email', 'created_at')
    search_fields = ('name', 'phone', 'email')


class OrderServiceInline(admin.TabularInline):
    model = OrderService
    extra = 1


class PaymentInline(admin.TabularInline):
    model = Payment
    extra = 1


class OrderAdmin(admin.ModelAdmin):
    list_display = ('order_number', 'customer', 'status', 'total_amount', 'payment_status', 'created_at')
    list_filter = ('status', 'payment_status', 'created_at')
    search_fields = ('order_number', 'customer__name', 'customer__phone')
    inlines = [OrderServiceInline, PaymentInline]
    readonly_fields = ('order_number', 'total_amount', 'created_at', 'updated_at')
    fieldsets = (
        (None, {'fields': ('order_number', 'customer', 'status', 'notes')}),
        ('Payment', {'fields': ('payment_status', 'payment_method', 'payment_date', 'total_amount')}),
        ('Timestamps', {'fields': ('created_at', 'updated_at'), 'classes': ('collapse',)}),
    )


class InvoiceAdmin(admin.ModelAdmin):
    list_display = ('invoice_number', 'order', 'issued_date')
    readonly_fields = ('invoice_number', 'issued_date')


class DocumentAdmin(admin.ModelAdmin):
    list_display = ('name', 'document_type', 'uploaded_at')
    list_filter = ('document_type',)


class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'submitted_at', 'is_read')
    list_filter = ('is_read',)


class SiteVisitAdmin(admin.ModelAdmin):
    list_display = ('page', 'visited_at')
    list_filter = ('page', 'visited_at')
    readonly_fields = ('page', 'visited_at')

    def has_add_permission(self, request):
        return False


class AuditLogAdmin(admin.ModelAdmin):
    list_display = ('timestamp', 'user', 'action', 'model_name', 'object_id')
    list_filter = ('action', 'model_name', 'timestamp')
    readonly_fields = ('timestamp', 'user', 'action', 'model_name', 'object_id', 'changes')

    def has_add_permission(self, request):
        return False


admin.site.register(Service, ServiceAdmin)
admin.site.register(Customer, CustomerAdmin)
admin.site.register(Order, OrderAdmin)
admin.site.register(Invoice, InvoiceAdmin)
admin.site.register(Document, DocumentAdmin)
admin.site.register(ContactMessage, ContactMessageAdmin)
admin.site.register(SiteVisit, SiteVisitAdmin)
admin.site.register(AuditLog, AuditLogAdmin)