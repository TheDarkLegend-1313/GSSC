from django.db import models

# Create your models here.
class SolarPanelCalculation(models.Model):
    appliances = models.JSONField()
    panel_watt = models.IntegerField()
    backup_hours = models.FloatField()


    max_inverter_capacity = models.FloatField()
    total_daily_power_kwh = models.FloatField()
    solar_panel_quantity = models.IntegerField()


    created_at = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return f"SolarPanelCalculation {self.id}"




class PowerCalculation(models.Model):
    solarpanel_quantity = models.IntegerField()
    panelwatt = models.IntegerField()
    backup_hours = models.FloatField()


    usable_power_kwh = models.FloatField()
    total_daily_power_kwh = models.FloatField()
    inverter_capacity_kwh = models.FloatField()
    battery_capacity_kwh = models.FloatField()


    created_at = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return f"PowerCalculation {self.id}"