from django.db import models
from django.core.validators import MinValueValidator


class Product(models.Model):
    """Base model for all products (Solar Panels, Inverters, Batteries)"""
    
    CATEGORY_CHOICES = [
        ('solar_panel', 'Solar Panel'),
        ('inverter', 'Inverter'),
        ('battery', 'Battery'),
    ]
    
    # Basic Information
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    company = models.CharField(max_length=200)
    model = models.CharField(max_length=200)
    price = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True, 
                                validators=[MinValueValidator(0)])
    description = models.TextField(blank=True, null=True)
    website = models.URLField(blank=True, null=True)
    
    # Solar Panel Specific Fields
    cell_type = models.CharField(max_length=100, blank=True, null=True)
    glass_thickness = models.CharField(max_length=50, blank=True, null=True)
    max_power = models.CharField(max_length=50, blank=True, null=True)  # e.g., "550W", "600W"
    max_system_voltage = models.CharField(max_length=50, blank=True, null=True)
    operating_temperature = models.CharField(max_length=100, blank=True, null=True)
    efficiency = models.CharField(max_length=50, blank=True, null=True)  # e.g., "21.5%"
    
    # Common Fields
    type = models.CharField(max_length=200, blank=True, null=True)
    features = models.TextField(blank=True, null=True)
    
    # Metadata
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    last_scraped = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['-updated_at']
        indexes = [
            models.Index(fields=['category']),
            models.Index(fields=['company']),
        ]
    
    def __str__(self):
        return f"{self.company} - {self.model} ({self.get_category_display()})"
