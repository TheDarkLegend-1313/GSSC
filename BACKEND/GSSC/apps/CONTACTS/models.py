from django.db import models

# Create your models here.

from django.db import models
from django.contrib.auth.models import User

class SolarProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    address = models.CharField(max_length=255)
    latitude = models.FloatField()
    longitude = models.FloatField()
    
    # Monthly average energy consumption in kWh
    avg_monthly_bill = models.FloatField(help_text="Average monthly bill in local currency")
    monthly_kwh_usage = models.FloatField(help_text="Average monthly consumption in kWh")
    
    # Roof characteristics
    roof_area_sqm = models.FloatField(default=0.0)
    is_shaded = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Solar Profile for {self.user.username}"

class SolarRecommendation(models.Model):
    profile = models.ForeignKey(SolarProfile, on_delete=models.CASCADE, related_name='recommendations')
    recommended_system_size_kw = models.FloatField()
    estimated_annual_generation_kwh = models.FloatField()
    estimated_cost = models.FloatField()
    payback_period_years = models.FloatField()
    carbon_offset_tonnes = models.FloatField()
    
    generated_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Recommendation {self.id} for {self.profile.user.username}"