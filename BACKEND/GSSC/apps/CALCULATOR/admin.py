from django.contrib import admin
from .models import SolarPanelCalculation, PowerCalculation
# Register your models here.
admin.site.register(SolarPanelCalculation)
admin.site.register(PowerCalculation)