from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import cm
from io import BytesIO
from .models import Order, Invoice
from django.core.files.base import ContentFile

def generate_invoice_pdf(order_id):
    order = Order.objects.get(id=order_id)
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4, title=f"Invoice_{order.order_number}")
    styles = getSampleStyleSheet()
    style_normal = styles['Normal']
    style_heading = ParagraphStyle(
        'Heading1',
        parent=styles['Heading1'],
        fontSize=14,
        spaceAfter=12,
        textColor=colors.HexColor('#1E3A8A')
    )
    
    content = []
    
    # Header
    content.append(Paragraph(f"Invoice #{order.order_number}", style_heading))
    content.append(Paragraph(f"Date: {order.created_at.strftime('%Y-%m-%d')}", style_normal))
    content.append(Spacer(1, 12))
    
    # Customer info
    content.append(Paragraph(f"<b>Bill To:</b><br/>{order.customer.name}<br/>{order.customer.phone}<br/>{order.customer.email}", style_normal))
    content.append(Spacer(1, 12))
    
    # Order details
    data = [['Service', 'Qty', 'Unit Price', 'Total']]
    for item in order.order_services.all():
        data.append([
            item.service.name,
            str(item.quantity),
            f"R {item.price_at_time:.2f}",
            f"R {item.price_at_time * item.quantity:.2f}"
        ])
    data.append(['', '', 'Subtotal', f"R {order.total_amount:.2f}"])
    if order.payment_method:
        data.append(['', '', 'Payment Method', order.get_payment_method_display()])
    
    table = Table(data, colWidths=[7*cm, 2*cm, 4*cm, 4*cm])
    table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#1E3A8A')),
        ('TEXTCOLOR', (0,0), (-1,0), colors.whitesmoke),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('BOTTOMPADDING', (0,0), (-1,0), 12),
        ('BACKGROUND', (0,1), (-1,-2), colors.HexColor('#F3F4F6')),
        ('GRID', (0,0), (-1,-1), 1, colors.HexColor('#E5E7EB')),
    ]))
    content.append(table)
    content.append(Spacer(1, 24))
    content.append(Paragraph(f"Status: {order.get_status_display()}", style_normal))
    content.append(Paragraph(f"Payment: {order.get_payment_status_display()}", style_normal))
    content.append(Paragraph("Thank you for your business!", style_normal))
    
    doc.build(content)
    buffer.seek(0)
    
    # Optionally save the PDF to the Invoice model
    invoice, created = Invoice.objects.get_or_create(order=order)
    invoice.pdf_file.save(f"invoice_{order.order_number}.pdf", ContentFile(buffer.getvalue()), save=True)
    
    buffer.seek(0)
    return buffer