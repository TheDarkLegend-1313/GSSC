from django.contrib import admin
from .models import Product


@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    list_display = ['company', 'model', 'category', 'price', 'updated_at', 'last_scraped']
    list_filter = ['category', 'company', 'created_at', 'updated_at']
    search_fields = ['company', 'model', 'description']
    readonly_fields = ['created_at', 'updated_at', 'last_scraped']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('category', 'company', 'model', 'price', 'description', 'website')
        }),
        ('Solar Panel Specifications', {
            'fields': ('cell_type', 'glass_thickness', 'max_power', 'max_system_voltage', 
                      'operating_temperature', 'efficiency'),
            'classes': ('collapse',)
        }),
        ('Additional Information', {
            'fields': ('type', 'features')
        }),
        ('Metadata', {
            'fields': ('created_at', 'updated_at', 'last_scraped'),
            'classes': ('collapse',)
        }),
    )
