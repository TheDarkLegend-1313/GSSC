from django.contrib import admin
from .models import Quotation


@admin.register(Quotation)
class QuotationAdmin(admin.ModelAdmin):
    list_display = ("user", "estimated_total_price", "roi", "updated_at")
